import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Calendar as CalendarIcon,
	CreditCard,
	Download,
	Pencil,
	Plus,
	Search,
	SlidersHorizontal,
	Trash2,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { apiRequest } from '@/utils/api';
import { id as localeId } from 'date-fns/locale';

type Expense = {
	_id: string;
	description: string;
	amount: number;
	expenseDate: string;
	category: string;
};

const formatRupiah = (amount: number) => {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

// Fungsi untuk parsing tanggal dari berbagai format
function parseExpenseDate(dateStr: string): Date | null {
	if (!dateStr) return null;
	// Backend sekarang selalu mengirim ISO string
	const isoDate = new Date(dateStr);
	if (!isNaN(isoDate.getTime())) return isoDate;
	return null;
}

const Expenses = () => {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
	const [editExpenseOpen, setEditExpenseOpen] = useState(false);
	const [editExpense, setEditExpense] = useState<Expense | null>(null);
	const [addExpenseOpen, setAddExpenseOpen] = useState(false);
	const [newExpense, setNewExpense] = useState<
		Omit<Expense, '_id'> & { amount: number | undefined }
	>({
		description: '',
		amount: undefined,
		expenseDate: format(new Date(), 'yyyy-MM-dd'),
		category: '',
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userCategories, setUserCategories] = useState<string[]>([]);

	// Ambil kategori unik user dari backend
	const fetchCategories = useCallback(async () => {
		try {
			const res = await apiRequest('/expenses/categories', {}, true);
			setUserCategories(res.data || []);
		} catch {
			setUserCategories([]);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Fetch expenses from API
	const fetchExpenses = async () => {
		setLoading(true);
		setError(null);
		try {
			let query = '?';
			if (categoryFilter) query += `category=${categoryFilter}&`;
			if (startDate) query += `startDate=${format(startDate, 'yyyy-MM-dd')}&`;
			if (endDate) query += `endDate=${format(endDate, 'yyyy-MM-dd')}&`;
			// TODO: add pagination if needed
			const res = await apiRequest(`/expenses${query}`, {}, true);
			setExpenses(res.data.expenses || res.data || []);
		} catch (err) {
			setError('Gagal memuat data pengeluaran');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchExpenses();
		// eslint-disable-next-line
	}, [categoryFilter, startDate, endDate]);

	// Handle search (client-side, bisa diubah ke server-side jika API support)
	const filteredExpenses = expenses.filter((expense) => {
		const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	// Untuk select kategori (tambah/edit), hanya tampilkan jika userCategories sudah ada
	const hasCategoryList = userCategories.length > 0;

	// Handle add expense
	const handleAddExpense = async () => {
		try {
			setLoading(true);
			setError(null);
			// Jika user hanya mengisi tanggal (tanpa jam), set jam ke waktu saat ini
			let expenseDate = newExpense.expenseDate;
			if (expenseDate && expenseDate.length === 10) {
				// yyyy-MM-dd
				const now = new Date();
				const [year, month, day] = expenseDate.split('-').map(Number);
				const withTime = new Date(
					year,
					month - 1,
					day,
					now.getHours(),
					now.getMinutes(),
					now.getSeconds(),
					now.getMilliseconds()
				);
				expenseDate = withTime.toISOString();
			}
			const res = await apiRequest(
				'/expenses',
				{
					method: 'POST',
					body: JSON.stringify({
						...newExpense,
						amount: Number(newExpense.amount),
						expenseDate,
					}),
				},
				true
			);
			// Tambahkan kategori manual ke userCategories jika belum ada
			if (newExpense.category && !userCategories.includes(newExpense.category)) {
				setUserCategories((prev) => [...prev, newExpense.category]);
			}
			setAddExpenseOpen(false);
			setNewExpense({
				description: '',
				amount: undefined,
				expenseDate: format(new Date(), 'yyyy-MM-dd'),
				category: '',
			});
			fetchExpenses();
		} catch (err) {
			setError('Gagal menambah pengeluaran');
		} finally {
			setLoading(false);
		}
	};

	// Handle edit expense
	const handleEditExpense = (expense: Expense) => {
		setEditExpense(expense);
		setEditExpenseOpen(true);
	};
	const saveEditedExpense = async () => {
		if (!editExpense) return;
		try {
			setLoading(true);
			setError(null);
			await apiRequest(
				`/expenses/${editExpense._id}`,
				{
					method: 'PUT',
					body: JSON.stringify({
						description: editExpense.description,
						amount: Number(editExpense.amount),
						expenseDate: editExpense.expenseDate,
						category: editExpense.category,
					}),
				},
				true
			);
			setEditExpenseOpen(false);
			setEditExpense(null);
			fetchExpenses();
		} catch (err) {
			setError('Gagal mengedit pengeluaran');
		} finally {
			setLoading(false);
		}
	};

	// Handle delete expense
	const handleDeleteExpense = (id: string) => {
		setSelectedExpenseId(id);
		setDeleteAlertOpen(true);
	};
	const confirmDelete = async () => {
		if (!selectedExpenseId) return;
		try {
			setLoading(true);
			setError(null);
			await apiRequest(`/expenses/${selectedExpenseId}`, { method: 'DELETE' }, true);
			setDeleteAlertOpen(false);
			setSelectedExpenseId(null);
			fetchExpenses();
		} catch (err) {
			setError('Gagal menghapus pengeluaran');
		} finally {
			setLoading(false);
		}
	};

	// Reset filters
	const resetFilters = () => {
		setCategoryFilter('');
		setStartDate(undefined);
		setEndDate(undefined);
		setSearchTerm('');
	};

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">Expenses</h1>
					<p className="text-gray-600">Manage and track your expenses</p>
				</div>
				<Button
					onClick={() => setAddExpenseOpen(true)}
					className="bg-primary-gradient hover:opacity-90"
				>
					<Plus className="mr-2 h-4 w-4" /> Add Expense
				</Button>
			</div>
			{error && <div className="text-red-600 mb-4">{error}</div>}
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					{/* Filters and Search */}
					<div className="flex flex-col lg:flex-row gap-4 mb-6">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Cari pengeluaran..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex gap-3">
							<Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
								<PopoverTrigger asChild>
									<Button variant="outline" className="flex items-center">
										<SlidersHorizontal className="mr-2 h-4 w-4" />
										Filter
										{(categoryFilter || startDate || endDate) && (
											<span className="ml-2 w-2 h-2 rounded-full bg-primary"></span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80">
									<div className="space-y-4">
										<h4 className="font-medium">Filter Pengeluaran</h4>
										<div className="space-y-2">
											<Label htmlFor="category">Kategori</Label>
											<Select value={categoryFilter} onValueChange={setCategoryFilter}>
												<SelectTrigger id="category">
													<SelectValue placeholder="Semua Kategori" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Semua Kategori</SelectItem>
													{userCategories.map((category) => (
														<SelectItem key={category} value={category}>
															{category}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label>Tanggal Range</Label>
											<div className="flex gap-2">
												<div className="flex-1">
													<Label htmlFor="start-date" className="text-xs text-gray-500">
														Dari
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-start text-left font-normal"
																id="start-date"
															>
																<CalendarIcon className="mr-2 h-4 w-4" />
																{startDate ? format(startDate, 'PPP') : <span>Pilih tanggal</span>}
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																mode="single"
																selected={startDate}
																onSelect={setStartDate}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
												</div>
												<div className="flex-1">
													<Label htmlFor="end-date" className="text-xs text-gray-500">
														Sampai
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-start text-left font-normal"
																id="end-date"
															>
																<CalendarIcon className="mr-2 h-4 w-4" />
																{endDate ? format(endDate, 'PPP') : <span>Pilih tanggal</span>}
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																mode="single"
																selected={endDate}
																onSelect={setEndDate}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
												</div>
											</div>
										</div>
										<div className="flex justify-between pt-2">
											<Button variant="outline" size="sm" onClick={resetFilters}>
												Reset Filter
											</Button>
											<Button size="sm" onClick={() => setIsFilterOpen(false)}>
												Terapkan Filter
											</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					{/* Expenses Table */}
					<Card>
						<CardHeader>
							<CardTitle>All Expenses</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Date</TableHead>
											<TableHead>Description</TableHead>
											<TableHead>Category</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredExpenses.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center text-gray-400">
													No data
												</TableCell>
											</TableRow>
										) : (
											filteredExpenses.map((expense) => (
												<TableRow key={expense._id}>
													<TableCell>
														{expense.expenseDate
															? (() => {
																	const parsed = parseExpenseDate(expense.expenseDate);
																	return parsed
																		? format(parsed, 'd MMMM yyyy', { locale: localeId })
																		: '-';
															  })()
															: '-'}
													</TableCell>
													<TableCell>{expense.description}</TableCell>
													<TableCell>{expense.category}</TableCell>
													<TableCell className="text-right">
														{formatRupiah(expense.amount)}
													</TableCell>
													<TableCell className="text-right">
														<Button
															size="icon"
															variant="ghost"
															onClick={() => handleEditExpense(expense)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															size="icon"
															variant="ghost"
															onClick={() => handleDeleteExpense(expense._id)}
														>
															<Trash2 className="h-4 w-4 text-red-500" />
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
					{/* Add Expense Dialog */}
					<Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Expense</DialogTitle>
								<DialogDescription>
									Fill in the details below to add a new expense.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Description</Label>
									<Input
										value={newExpense.description}
										onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
										placeholder="Description"
									/>
								</div>
								<div>
									<Label>Amount (Rp)</Label>
									<Input
										type="number"
										value={newExpense.amount === undefined ? '' : newExpense.amount}
										onChange={(e) =>
											setNewExpense({
												...newExpense,
												amount: e.target.value === '' ? undefined : Number(e.target.value),
											})
										}
										placeholder="0"
									/>
								</div>
								<div>
									<Label>Category</Label>
									{hasCategoryList && (
										<Select
											value={
												newExpense.category && userCategories.includes(newExpense.category)
													? newExpense.category
													: ''
											}
											onValueChange={(cat) => setNewExpense({ ...newExpense, category: cat })}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{userCategories.map((cat) => (
													<SelectItem key={cat} value={cat}>
														{cat}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
									<Input
										placeholder="Type or select category"
										value={newExpense.category}
										maxLength={30}
										onChange={(e) => {
											let val = e.target.value;
											if (val.length === 1) val = val.toUpperCase();
											setNewExpense({ ...newExpense, category: val });
										}}
									/>
								</div>
								<div>
									<Label>Date</Label>
									<Input
										type="date"
										value={newExpense.expenseDate}
										onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={handleAddExpense}>Add</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					{/* Edit Expense Dialog */}
					<Dialog open={editExpenseOpen} onOpenChange={setEditExpenseOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Expense</DialogTitle>
								<DialogDescription>Update the details below.</DialogDescription>
							</DialogHeader>
							{editExpense && (
								<div className="space-y-4">
									<div>
										<Label>Description</Label>
										<Input
											value={editExpense.description}
											onChange={(e) =>
												setEditExpense({ ...editExpense, description: e.target.value })
											}
											placeholder="Description"
										/>
									</div>
									<div>
										<Label>Amount (Rp)</Label>
										<Input
											type="number"
											value={editExpense.amount}
											onChange={(e) =>
												setEditExpense({ ...editExpense, amount: Number(e.target.value) })
											}
											placeholder="Amount"
										/>
									</div>
									<div>
										<Label>Category</Label>
										{hasCategoryList && (
											<Select
												value={editExpense.category}
												onValueChange={(cat) => setEditExpense({ ...editExpense, category: cat })}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{userCategories.map((cat) => (
														<SelectItem key={cat} value={cat}>
															{cat}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									</div>
									<div>
										<Label>Date</Label>
										<Input
											type="date"
											value={editExpense.expenseDate?.slice(0, 10) || ''}
											onChange={(e) =>
												setEditExpense({ ...editExpense, expenseDate: e.target.value })
											}
										/>
									</div>
								</div>
							)}
							<DialogFooter>
								<Button onClick={saveEditedExpense}>Save</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					{/* Delete Alert Dialog */}
					<AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Expense</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this expense?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</DashboardLayout>
	);
};

export default Expenses;
