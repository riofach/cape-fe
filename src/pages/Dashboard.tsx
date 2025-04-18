import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, CreditCard, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { apiRequest } from '@/utils/api';

const formatRupiah = (amount: number) => {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

// Fungsi format singkat untuk YAxis
function formatShortRupiah(value: number) {
	if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`;
	if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}Jt`;
	if (value >= 1_000) return `Rp${(value / 1_000).toFixed(1)}K`;
	return `Rp${value}`;
}

const Dashboard = () => {
	const [showAddExpense, setShowAddExpense] = useState(false);
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [categoryData, setCategoryData] = useState<
		{ name: string; value: number; color: string }[]
	>([]);
	const [recentTransactions, setRecentTransactions] = useState<
		{
			_id: string;
			description: string;
			amount: number;
			expenseDate?: string;
			category: string;
		}[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [monthlyExpenses, setMonthlyExpenses] = useState<{ label: string; total: number }[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				// Ambil laporan bulanan
				const report = await apiRequest('/expenses/report/monthly', {}, true);
				setTotalExpenses(report.data.total || 0);
				// Mapping kategori ke format PieChart
				const colors = [
					'#0088FE',
					'#00C49F',
					'#FFBB28',
					'#FF8042',
					'#8884d8',
					'#82ca9d',
					'#E57373',
					'#BA68C8',
					'#FFD54F',
					'#4FC3F7',
				];
				setCategoryData(
					(report.data.categories || []).map(
						(cat: { name: string; amount: number }, idx: number) => ({
							name: cat.name,
							value: cat.amount,
							color: colors[idx % colors.length],
						})
					)
				);
				// Ambil data chart bulanan
				const monthly = await apiRequest('/expenses/report/last6months', {}, true);
				setMonthlyExpenses(monthly.data || []);
				// Ambil 5 transaksi terakhir
				const recent = await apiRequest('/expenses/recent', {}, true);
				setRecentTransactions(recent.data || []);
			} catch (err) {
				setError('Gagal memuat data dashboard');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Hitung average daily spending (asumsi 30 hari)
	const averageDailySpending = totalExpenses ? Math.round(totalExpenses / 30) : 0;

	// Temukan kategori dengan persentase tertinggi
	const biggestCategory =
		categoryData.length > 0
			? categoryData.reduce((max, cat) => (cat.value > max.value ? cat : max), categoryData[0])
			: null;
	const biggestCategoryPercent =
		biggestCategory && totalExpenses > 0
			? Math.round((biggestCategory.value / totalExpenses) * 100)
			: 0;

	// Untuk Spending by Category, ambil hanya 6 kategori terbesar
	const topCategories = [...categoryData].sort((a, b) => b.value - a.value).slice(0, 6);

	// Urutkan recentTransactions dari terbaru ke terlama
	const sortedRecentTransactions = [...recentTransactions].sort((a, b) => {
		const dateA = a.expenseDate ? new Date(a.expenseDate).getTime() : 0;
		const dateB = b.expenseDate ? new Date(b.expenseDate).getTime() : 0;
		return dateB - dateA;
	});

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
					<p className="text-gray-600">Overview of your personal finances</p>
				</div>
				{/* <Button
					onClick={() => setShowAddExpense(true)}
					className="bg-primary-gradient hover:opacity-90"
				>
					<Plus className="mr-2 h-4 w-4" /> Add Expense
				</Button> */}
			</div>
			{error && <div className="text-red-600 mb-4">{error}</div>}
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{/* Total Expenses Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-500">
									Total Expenses (This Month)
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<span className="text-2xl font-bold">{formatRupiah(totalExpenses)}</span>
									</div>
								</div>
								<p className="text-xs text-gray-500 mt-1">Compared to last month</p>
							</CardContent>
						</Card>
						{/* Average Daily Spending */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-500">
									Average Daily Spending
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center">
									<span className="text-2xl font-bold">{formatRupiah(averageDailySpending)}</span>
								</div>
								<p className="text-xs text-gray-500 mt-1">30 days in this month</p>
							</CardContent>
						</Card>
						{/* Biggest Expense Category */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-500">
									Biggest Expense Category
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<span className="text-2xl font-bold">{biggestCategory?.name || '-'}</span>
										<p className="text-xs text-gray-500 mt-1">
											{biggestCategory ? `${biggestCategoryPercent}% of total expenses` : '-'}
										</p>
									</div>
									<div
										className="w-10 h-10 rounded-full"
										style={{ background: biggestCategory?.color || '#00C49F' }}
									>
										<CreditCard className="h-5 w-5 text-white mx-auto my-2" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						{/* Monthly Expenses Chart */}
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Monthly Expenses</CardTitle>
								<CardDescription>Your spending over the past 6 months</CardDescription>
							</CardHeader>
							<CardContent className="h-80 flex items-center justify-center">
								{monthlyExpenses.length === 0 ? (
									<span className="text-gray-400">No data</span>
								) : (
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={monthlyExpenses}
											margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="label" />
											<YAxis tickFormatter={formatShortRupiah} />
											<Tooltip formatter={(value) => formatRupiah(Number(value))} />
											<Bar
												dataKey="total"
												fill="url(#barGradient)"
												radius={[8, 8, 0, 0]}
												barSize={40}
											/>
											<defs>
												<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="0%" stopColor="#2E7D32" />
													<stop offset="100%" stopColor="#81C784" />
												</linearGradient>
											</defs>
										</BarChart>
									</ResponsiveContainer>
								)}
							</CardContent>
						</Card>
						{/* Category Breakdown */}
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Spending by Category</CardTitle>
								<CardDescription>Breakdown of your expenses by category</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col h-80">
								<div className="flex-1">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={topCategories}
												cx="50%"
												cy="50%"
												innerRadius={70}
												outerRadius={100}
												paddingAngle={2}
												dataKey="value"
												label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
												labelLine={false}
											>
												{topCategories.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip
												formatter={(value) => [`Rp${value.toLocaleString('id-ID')}`, 'Amount']}
												contentStyle={{
													borderRadius: '8px',
													border: '1px solid #e2e8f0',
													boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
												}}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className="flex justify-center space-x-4 mt-4">
									{topCategories.map((category, index) => (
										<div key={index} className="flex items-center space-x-2">
											<span
												className="w-3 h-3 rounded-full"
												style={{ background: category.color }}
											></span>
											<span className="text-xs text-gray-700">{category.name}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
					{/* Recent Transactions */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Recent Transactions</CardTitle>
								<CardDescription>Your latest expenses</CardDescription>
							</div>
							<Button variant="ghost" size="sm" className="text-primary">
								View All <ArrowUpRight className="ml-1 h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{sortedRecentTransactions.map((transaction) => (
									<div
										key={transaction._id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									>
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
												<CreditCard className="h-5 w-5" />
											</div>
											<div>
												<p className="font-medium text-gray-900">{transaction.description}</p>
												<p className="text-sm text-gray-500">
													{transaction.expenseDate
														? new Date(transaction.expenseDate).toLocaleDateString('en-US', {
																year: 'numeric',
																month: 'short',
																day: 'numeric',
														  })
														: '-'}
													{' · '}
													{transaction.category}
												</p>
											</div>
										</div>
										<div className="flex items-center">
											<span className="font-medium text-gray-900">
												{formatRupiah(transaction.amount)}
											</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</DashboardLayout>
	);
};

export default Dashboard;
