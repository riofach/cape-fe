import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Search, SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { apiRequest } from '@/utils/api';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

// Tipe data Income sesuai backend
export type Income = {
	_id: string;
	amount: number;
	category: string;
	description: string;
	incomeDate: string;
};

const formatRupiah = (amount: number) => {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

const IncomePage = () => {
	const [incomes, setIncomes] = useState<Income[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [userCategories, setUserCategories] = useState<string[]>([]);
	const [date, setDate] = useState<Date>(); // Untuk form tambah income
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [addIncome, setAddIncome] = useState({
		amount: '',
		category: '',
		description: '',
		incomeDate: '',
	});
	const [addLoading, setAddLoading] = useState(false);
	const [addError, setAddError] = useState<string | null>(null);
	const [editIncome, setEditIncome] = useState<Income | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [editError, setEditError] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedIncomeId, setSelectedIncomeId] = useState<string | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [customCategoryAdd, setCustomCategoryAdd] = useState('');
	const [showCustomInputAdd, setShowCustomInputAdd] = useState(false);
	const [customCategoryEdit, setCustomCategoryEdit] = useState('');
	const [showCustomInputEdit, setShowCustomInputEdit] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 25;

	// Template kategori default income
	const defaultIncomeCategories = [
		'Salary',
		'Freelance',
		'Investments',
		'Business',
		'Bonus',
		'Gift',
		'Cashback',
		'Other',
	];

	// Untuk select kategori (tambah/edit), hanya tampilkan jika userCategories sudah ada
	const hasCategoryList = userCategories.length > 0;

	// Untuk select kategori (tambah/edit), gabungkan userCategories dan defaultIncomeCategories tanpa duplikat
	const allIncomeCategories = Array.from(
		new Set([...defaultIncomeCategories, ...userCategories])
	).filter(Boolean);

	// Fetch kategori unik income user
	const fetchCategories = useCallback(async () => {
		try {
			const res = await apiRequest('/income/categories', {}, true);
			setUserCategories(res.data || []);
		} catch {
			setUserCategories([]);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Fetch income dari backend
	const fetchIncomes = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			let query = '?';
			const cat = categoryFilter === 'all' ? '' : categoryFilter;
			if (cat) query += `category=${cat}&`;
			if (startDate) query += `startDate=${format(startDate, 'yyyy-MM-dd')}&`;
			if (endDate) query += `endDate=${format(endDate, 'yyyy-MM-dd')}&`;
			const res = await apiRequest(`/income${query}`, {}, true);
			setIncomes(res.data || []);
		} catch (err) {
			setError('Gagal memuat data pemasukan');
		} finally {
			setLoading(false);
		}
	}, [categoryFilter, startDate, endDate]);

	useEffect(() => {
		fetchIncomes();
	}, [fetchIncomes]);

	// Filter dan search (client-side, bisa diubah ke server-side jika API support)
	const filteredIncomes = incomes.filter((income) => {
		const matchesSearch = income.description?.toLowerCase().includes(searchTerm.toLowerCase());
		// Filter tanggal (jika startDate/endDate diisi, bandingkan hanya tanggalnya saja)
		let matchesDate = true;
		if (startDate) {
			const incomeDate = new Date(income.incomeDate);
			const start = new Date(startDate);
			start.setHours(0, 0, 0, 0);
			incomeDate.setHours(0, 0, 0, 0);
			matchesDate = incomeDate >= start;
		}
		if (endDate && matchesDate) {
			const incomeDate = new Date(income.incomeDate);
			const end = new Date(endDate);
			end.setHours(23, 59, 59, 999);
			matchesDate = incomeDate <= end;
		}
		return matchesSearch && matchesDate;
	});

	// Pagination logic
	const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = filteredIncomes.slice(startIndex, endIndex);

	// Reset currentPage ke 1 jika filter/search berubah
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, categoryFilter, startDate, endDate]);

	// Helper untuk page number
	const getPageNumbers = () => {
		const pages = [];
		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
				pages.push(i);
			} else if (i === currentPage - 2 || i === currentPage + 2) {
				pages.push('...');
			}
		}
		return pages.filter((page, index, array) => array.indexOf(page) === index);
	};

	// Summary
	const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
	const averageIncome =
		filteredIncomes.length > 0 ? Math.round(totalIncome / filteredIncomes.length) : 0;
	const highestIncome = filteredIncomes.reduce((max, i) => (i.amount > max ? i.amount : max), 0);
	const highestIncomeObj = filteredIncomes.find((i) => i.amount === highestIncome);

	// Reset filters
	const resetFilters = () => {
		setCategoryFilter('');
		setStartDate(undefined);
		setEndDate(undefined);
		setSearchTerm('');
	};

	// Reset custom input state saat dialog/modal close
	useEffect(() => {
		if (!editDialogOpen) {
			setShowCustomInputEdit(false);
			setCustomCategoryEdit('');
		}
	}, [editDialogOpen]);

	// Reset custom input add saat form selesai
	// Handler tambah income
	const handleAddIncome = async () => {
		setAddError(null);
		if (!addIncome.amount || !addIncome.category || !addIncome.description) {
			setAddError('Semua field wajib diisi');
			return;
		}
		setAddLoading(true);
		try {
			let incomeDate = addIncome.incomeDate;
			if (incomeDate && incomeDate.length === 10) {
				const now = new Date();
				const [year, month, day] = incomeDate.split('-').map(Number);
				const withTime = new Date(
					year,
					month - 1,
					day,
					now.getHours(),
					now.getMinutes(),
					now.getSeconds(),
					now.getMilliseconds()
				);
				incomeDate = withTime.toISOString();
			}
			await apiRequest(
				'/income',
				{
					method: 'POST',
					body: JSON.stringify({
						amount: Number(addIncome.amount),
						category: addIncome.category,
						description: addIncome.description,
						incomeDate: incomeDate || undefined,
					}),
				},
				true
			);
			// Tambahkan kategori manual ke userCategories jika belum ada
			if (addIncome.category && !userCategories.includes(addIncome.category)) {
				setUserCategories((prev) => [...prev, addIncome.category]);
			}
			setAddIncome({ amount: '', category: '', description: '', incomeDate: '' });
			fetchIncomes();
		} catch (err) {
			setAddError('Gagal menambah pemasukan');
		} finally {
			setAddLoading(false);
		}
	};

	// Handler edit
	const handleEditIncome = (income: Income) => {
		setEditIncome({ ...income });
		setEditDialogOpen(true);
		setEditError(null);
	};
	const saveEditedIncome = async () => {
		if (!editIncome) return;
		setEditLoading(true);
		setEditError(null);
		try {
			await apiRequest(
				`/income/${editIncome._id}`,
				{
					method: 'PUT',
					body: JSON.stringify({
						amount: Number(editIncome.amount),
						category: editIncome.category,
						description: editIncome.description,
						incomeDate: editIncome.incomeDate,
					}),
				},
				true
			);
			setEditDialogOpen(false);
			setEditIncome(null);
			fetchIncomes();
		} catch (err) {
			setEditError('Gagal mengedit pemasukan');
		} finally {
			setEditLoading(false);
		}
	};

	// Handler delete
	const handleDeleteIncome = (id: string) => {
		setSelectedIncomeId(id);
		setDeleteDialogOpen(true);
		setDeleteError(null);
	};
	const confirmDeleteIncome = async () => {
		if (!selectedIncomeId) return;
		setDeleteLoading(true);
		setDeleteError(null);
		try {
			await apiRequest(`/income/${selectedIncomeId}`, { method: 'DELETE' }, true);
			setDeleteDialogOpen(false);
			setSelectedIncomeId(null);
			fetchIncomes();
		} catch (err) {
			setDeleteError('Gagal menghapus pemasukan');
		} finally {
			setDeleteLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
					<h1 className="text-2xl font-bold">Income Tracking</h1>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Total Income
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
							<p className="text-xs text-green-600 mt-1">
								{filteredIncomes.length > 0
									? `+${Math.round(
											(totalIncome / (filteredIncomes.length || 1)) * 0.15
									  )}% from last month`
									: ''}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Average per Entry
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{formatRupiah(averageIncome)}</div>
							<p className="text-xs text-muted-foreground mt-1">
								Based on {filteredIncomes.length} entries
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Highest Income
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{formatRupiah(highestIncome)}</div>
							<p className="text-xs text-muted-foreground mt-1">
								{highestIncomeObj ? `From ${highestIncomeObj.category}` : ''}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Filter & Search */}
				<div className="flex flex-col lg:flex-row gap-4 mb-6">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Cari pemasukan..."
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
									<h4 className="font-medium">Filter Pemasukan</h4>
									<div className="space-y-2">
										<Label htmlFor="category">Kategori</Label>
										<Select value={categoryFilter} onValueChange={setCategoryFilter}>
											<SelectTrigger id="category">
												<SelectValue placeholder="Semua Kategori" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">Semua Kategori</SelectItem>
												{allIncomeCategories.map((category) => (
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

				{/* Loading & Error State */}
				{error && <div className="text-red-600 mb-4">{error}</div>}
				{loading ? (
					<div>Loading...</div>
				) : (
					<>
						{/* Form tambah income */}
						<Card>
							<CardHeader>
								<CardTitle>Add Income</CardTitle>
								<CardDescription>
									Record your income sources to track your financial flow.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
									<div className="grid gap-2">
										<Label htmlFor="amount">Amount (Rp)</Label>
										<Input
											id="amount"
											placeholder="0"
											type="number"
											value={addIncome.amount}
											onChange={(e) => setAddIncome({ ...addIncome, amount: e.target.value })}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="category">Category</Label>
										{hasCategoryList && (
											<Select
												value={
													addIncome.category && userCategories.includes(addIncome.category)
														? addIncome.category
														: ''
												}
												onValueChange={(cat) => setAddIncome({ ...addIncome, category: cat })}
											>
												<SelectTrigger id="category">
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
											id="category"
											placeholder="Type or select category"
											value={addIncome.category}
											maxLength={30}
											onChange={(e) => {
												let val = e.target.value;
												if (val.length === 1) val = val.toUpperCase();
												setAddIncome({ ...addIncome, category: val });
											}}
										/>
									</div>
									<div className="grid gap-2">
										<Label>Date</Label>
										<Input
											type="date"
											value={addIncome.incomeDate}
											onChange={(e) => setAddIncome({ ...addIncome, incomeDate: e.target.value })}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="description">Description</Label>
										<Input
											id="description"
											placeholder="Add details..."
											value={addIncome.description}
											onChange={(e) => setAddIncome({ ...addIncome, description: e.target.value })}
										/>
									</div>
								</div>
								{addError && <div className="text-red-600 mt-2">{addError}</div>}
							</CardContent>
							<CardFooter className="justify-between space-x-2">
								<Button
									variant="ghost"
									onClick={() =>
										setAddIncome({ amount: '', category: '', description: '', incomeDate: '' })
									}
								>
									Reset
								</Button>
								<Button onClick={handleAddIncome} disabled={addLoading}>
									{addLoading ? 'Saving...' : 'Save Income'}
								</Button>
							</CardFooter>
						</Card>

						{/* History income */}
						<Card>
							<CardHeader className="flex flex-row items-center">
								<div className="space-y-1.5">
									<CardTitle>Income History</CardTitle>
									<CardDescription>View and manage your recorded income.</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-1 gap-4">
										{currentItems.map((income) => (
											<div
												key={income._id}
												className="flex items-center justify-between rounded-lg border p-4"
											>
												<div className="space-y-1">
													<p className="text-sm font-medium">{income.category}</p>
													<p className="text-xs text-muted-foreground">
														{income.incomeDate
															? format(new Date(income.incomeDate), 'yyyy-MM-dd')
															: '-'}
													</p>
													<p className="text-xs text-muted-foreground">{income.description}</p>
												</div>
												<div className="flex items-center gap-2">
													<p className="text-sm font-bold text-green-600">
														+{formatRupiah(income.amount)}
													</p>
													<Button
														size="icon"
														variant="ghost"
														onClick={() => handleEditIncome(income)}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														size="icon"
														variant="ghost"
														onClick={() => handleDeleteIncome(income._id)}
													>
														<Trash2 className="h-4 w-4 text-red-500" />
													</Button>
												</div>
											</div>
										))}
									</div>
									{/* Pagination */}
									{totalPages > 1 && (
										<Pagination>
											<PaginationContent>
												<PaginationItem>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
														disabled={currentPage === 1}
													>
														Previous
													</Button>
												</PaginationItem>
												{getPageNumbers().map((page, index) => (
													<PaginationItem key={index}>
														{page === '...' ? (
															<span className="px-4 py-2">...</span>
														) : (
															<Button
																variant={currentPage === page ? 'default' : 'outline'}
																size="sm"
																onClick={() => setCurrentPage(Number(page))}
															>
																{page}
															</Button>
														)}
													</PaginationItem>
												))}
												<PaginationItem>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
														disabled={currentPage === totalPages}
													>
														Next
													</Button>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Edit Income Dialog */}
						<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Edit Income</DialogTitle>
									<DialogDescription>Update the details below.</DialogDescription>
								</DialogHeader>
								{editIncome && (
									<div className="space-y-4">
										<div>
											<Label>Amount (Rp)</Label>
											<Input
												type="number"
												value={editIncome.amount}
												onChange={(e) =>
													setEditIncome({ ...editIncome, amount: Number(e.target.value) })
												}
												placeholder="Amount"
											/>
										</div>
										<div>
											<Label>Category</Label>
											{hasCategoryList && (
												<Select
													value={editIncome?.category || ''}
													onValueChange={(cat) =>
														setEditIncome(editIncome ? { ...editIncome, category: cat } : null)
													}
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
												value={editIncome.incomeDate?.slice(0, 10) || ''}
												onChange={(e) =>
													setEditIncome({ ...editIncome, incomeDate: e.target.value })
												}
											/>
										</div>
										<div>
											<Label>Description</Label>
											<Input
												value={editIncome.description}
												onChange={(e) =>
													setEditIncome({ ...editIncome, description: e.target.value })
												}
												placeholder="Description"
											/>
										</div>
									</div>
								)}
								{editError && <div className="text-red-600 mt-2">{editError}</div>}
								<DialogFooter>
									<Button onClick={saveEditedIncome} disabled={editLoading}>
										{editLoading ? 'Saving...' : 'Save'}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{/* Delete Alert Dialog */}
						<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Income</AlertDialogTitle>
									<AlertDialogDescription>
										Apakah Anda yakin ingin menghapus pemasukan ini?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Batal</AlertDialogCancel>
									<AlertDialogAction onClick={confirmDeleteIncome} disabled={deleteLoading}>
										{deleteLoading ? 'Menghapus...' : 'Hapus'}
									</AlertDialogAction>
								</AlertDialogFooter>
								{deleteError && <div className="text-red-600 mt-2">{deleteError}</div>}
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
			</div>
		</DashboardLayout>
	);
};

export default IncomePage;
