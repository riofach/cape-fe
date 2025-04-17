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
										<span className="text-2xl font-bold">{categoryData[0]?.name || '-'}</span>
										<p className="text-xs text-gray-500 mt-1">
											{categoryData[0]
												? `${Math.round(
														(categoryData[0].value / (totalExpenses || 1)) * 100
												  )}% of total expenses`
												: '-'}
										</p>
									</div>
									<div
										className="w-10 h-10 rounded-full"
										style={{ background: categoryData[0]?.color || '#00C49F' }}
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
											<YAxis tickFormatter={formatRupiah} />
											<Tooltip formatter={(value) => formatRupiah(Number(value))} />
											<Bar dataKey="total" fill="#0088FE" radius={[8, 8, 0, 0]} />
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
												data={categoryData}
												cx="50%"
												cy="50%"
												innerRadius={70}
												outerRadius={100}
												paddingAngle={2}
												dataKey="value"
												label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
												labelLine={false}
											>
												{categoryData.map((entry, index) => (
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
									{categoryData.map((category, index) => (
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
					<div className="mb-8">
						<Card>
							<CardHeader>
								<CardTitle>Recent Transactions</CardTitle>
								<CardDescription>5 most recent expenses</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Date
												</th>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Description
												</th>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Category
												</th>
												<th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
													Amount
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{recentTransactions.length === 0 ? (
												<tr>
													<td colSpan={4} className="text-center py-4 text-gray-400">
														No data
													</td>
												</tr>
											) : (
												recentTransactions.map((tx) => (
													<tr key={tx._id}>
														<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
															{tx.expenseDate
																? new Date(tx.expenseDate).toLocaleDateString('id-ID')
																: '-'}
														</td>
														<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
															{tx.description}
														</td>
														<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
															{tx.category}
														</td>
														<td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium">
															{formatRupiah(tx.amount)}
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>
				</>
			)}
		</DashboardLayout>
	);
};

export default Dashboard;
