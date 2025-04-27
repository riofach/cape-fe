import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Calendar as CalendarIcon,
	Download,
	FileText,
	BarChart,
	PieChart,
	TrendingUp,
	FileDown,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
	BarChart as ReBarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart as RePieChart,
	Pie,
	Cell,
	AreaChart,
	Area,
} from 'recharts';
import { apiFetch } from '@/lib/api';
import type { TooltipProps } from 'recharts';

// Mock monthly expense data
const monthlyData = [
	{ month: 'Jan', amount: 18_000_000, budget: 22_500_000 },
	{ month: 'Feb', amount: 14_700_000, budget: 22_500_000 },
	{ month: 'Mar', amount: 16_000_000, budget: 22_500_000 },
	{ month: 'Apr', amount: 14_580_000, budget: 22_500_000 },
	{ month: 'May', amount: 11_000_000, budget: 22_500_000 },
	{ month: 'Jun', amount: 12_500_000, budget: 22_500_000 },
	{ month: 'Jul', amount: 14_200_000, budget: 22_500_000 },
	{ month: 'Aug', amount: 13_500_000, budget: 22_500_000 },
	{ month: 'Sep', amount: 11_900_000, budget: 22_500_000 },
	{ month: 'Oct', amount: 15_500_000, budget: 22_500_000 },
	{ month: 'Nov', amount: 16_700_000, budget: 22_500_000 },
	{ month: 'Dec', amount: 19_500_000, budget: 22_500_000 },
];

// Category data
const categoryData = [
	{ name: 'Makanan', value: 63_000_000, color: '#0088FE' },
	{ name: 'Perumahan', value: 126_000_000, color: '#00C49F' },
	{ name: 'Transportasi', value: 29_000_000, color: '#FFBB28' },
	{ name: 'Entertainment', value: 18_000_000, color: '#FF8042' },
	{ name: 'Pengeluaran Listrik', value: 22_000_000, color: '#8884d8' },
	{ name: 'Kesehatan', value: 11_000_000, color: '#82ca9d' },
	{ name: 'Lainnya', value: 14_000_000, color: '#ffc658' },
];

// Top spending categories
const topSpendingData = categoryData.sort((a, b) => b.value - a.value).slice(0, 5);

// Available years for reports
const reportYears = ['2025', '2024', '2023'];

// Available months for reports
const reportMonths = [
	{ label: 'Januari', value: '01' },
	{ label: 'Februari', value: '02' },
	{ label: 'Maret', value: '03' },
	{ label: 'April', value: '04' },
	{ label: 'Mei', value: '05' },
	{ label: 'Juni', value: '06' },
	{ label: 'Juli', value: '07' },
	{ label: 'Agustus', value: '08' },
	{ label: 'September', value: '09' },
	{ label: 'Oktober', value: '10' },
	{ label: 'November', value: '11' },
	{ label: 'Desember', value: '12' },
];

// Helper untuk konversi angka bulan ke singkatan nama bulan
const monthShortNames = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

// Helper untuk format singkat rupiah
const formatShortRupiah = (value: number) => {
	if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`;
	if (value >= 1_000_000) return `Rp${(value / 1_000).toLocaleString('id-ID')}K`;
	if (value >= 1_000) return `Rp${(value / 1_000).toLocaleString('id-ID')}K`;
	return `Rp${value}`;
};

type ReportMonthly = {
	month: number;
	year: number;
	total: number;
	budget: number;
	averageDaily: number;
	trend: number;
	categories: { name: string; amount: number }[];
};

// Custom Tooltip untuk Expenses vs Budget agar label bulan singkat
const CustomBarTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
	if (active && payload && payload.length) {
		return (
			<div
				className="custom-tooltip"
				style={{ background: '#fff', border: '1px solid #ccc', padding: 10, borderRadius: 8 }}
			>
				<div style={{ fontWeight: 600, marginBottom: 4 }}>
					{monthShortNames[(Number(label) - 1) % 12]}
				</div>
				{payload.map((item, idx) => (
					<div key={idx} style={{ color: item.color, marginBottom: 2 }}>
						{item.name} : Rp {item.value?.toLocaleString('id-ID')}
					</div>
				))}
			</div>
		);
	}
	return null;
};

// Warna kategori konsisten dengan Dashboard
const categoryColors = [
	'#0088FE', // Biru
	'#00C49F', // Hijau
	'#FFBB28', // Kuning
	'#FF8042', // Oranye
	'#8884d8', // Ungu
	'#82ca9d', // Hijau muda
	'#E57373', // Merah
	'#BA68C8', // Ungu muda
	'#FFD54F', // Kuning muda
	'#4FC3F7', // Biru muda
];

// Tambahkan tipe data
interface DailyExpense {
	day: number;
	amount: number;
	categories: { category: string; amount: number }[];
}

// Helper untuk format tanggal dari day, month, year
const formatDayLabel = (day: number, month: string, year: string) => {
	const monthNum = parseInt(month, 10) - 1;
	const date = new Date(Number(year), monthNum, day);
	return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
};

const Reports = () => {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
	const [selectedMonth, setSelectedMonth] = useState(
		(new Date().getMonth() + 1).toString().padStart(2, '0')
	);
	const [selectedTab, setSelectedTab] = useState('overview');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [report, setReport] = useState<ReportMonthly | null>(null);
	const [yearlyData, setYearlyData] = useState<{ month: number; total: number; budget: number }[]>(
		[]
	);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [forbidden, setForbidden] = useState(false);
	const [categoryReport, setCategoryReport] = useState<{ name: string; amount: number }[]>([]);
	const [dailyData, setDailyData] = useState<DailyExpense[]>([]);
	const [dailyLoading, setDailyLoading] = useState(false);
	const [dailyError, setDailyError] = useState<string | null>(null);
	const navigate = useNavigate();

	const fetchReport = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = sessionStorage.getItem('token');
			const res = await apiFetch(
				`/api/expenses/report/monthly?month=${parseInt(selectedMonth, 10)}&year=${selectedYear}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setReport(res.data);
		} catch (err: unknown) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'status' in err &&
				(err as { status?: number }).status === 403
			) {
				setForbidden(true);
				setReport(null);
				return;
			}
			setError('Gagal memuat laporan');
		} finally {
			setLoading(false);
		}
	};

	const fetchYearly = async () => {
		try {
			const token = sessionStorage.getItem('token');
			const res = await apiFetch(`/api/expenses/report/yearly?year=${selectedYear}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setYearlyData(res.data || []);
		} catch (err: unknown) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'status' in err &&
				(err as { status?: number }).status === 403
			) {
				setForbidden(true);
				setYearlyData([]);
				return;
			}
			// Tidak perlu error state khusus, biarkan kosong
		}
	};

	const fetchCategoryReport = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = sessionStorage.getItem('token');
			const res = await apiFetch(
				`/api/expenses/report/monthly?month=${parseInt(selectedMonth, 10)}&year=${selectedYear}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const categories = (res.data.categories || []).map(
				(cat: { name?: string; category?: string; amount: number }) => ({
					name: cat.name || cat.category,
					amount: Number(cat.amount ?? 0),
				})
			);
			setCategoryReport(categories);
		} catch (err) {
			setCategoryReport([]);
			setError('Gagal memuat data kategori');
		} finally {
			setLoading(false);
		}
	};

	// Fetch daily expenses dari backend
	const fetchDaily = async () => {
		setDailyLoading(true);
		setDailyError(null);
		try {
			const token = sessionStorage.getItem('token');
			const res = await apiFetch(
				`/api/expenses/report/daily?month=${parseInt(selectedMonth, 10)}&year=${selectedYear}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setDailyData(res.data || []);
		} catch (err) {
			setDailyError('Gagal memuat data pengeluaran harian');
			setDailyData([]);
		} finally {
			setDailyLoading(false);
		}
	};

	useEffect(() => {
		fetchReport();
		fetchYearly();
		// eslint-disable-next-line
	}, [selectedMonth, selectedYear]);

	useEffect(() => {
		if (selectedTab === 'categories') {
			fetchCategoryReport();
		}
		// eslint-disable-next-line
	}, [selectedTab, selectedMonth, selectedYear]);

	useEffect(() => {
		if (selectedTab === 'daily') {
			fetchDaily();
		}
		// eslint-disable-next-line
	}, [selectedTab, selectedMonth, selectedYear]);

	useEffect(() => {
		// Ambil role user dari backend secara real-time
		const fetchUserRole = async () => {
			try {
				const token = sessionStorage.getItem('token');
				const res = await apiFetch('/api/auth/profile', {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res && res.data && res.data.role) setUserRole(res.data.role.toLowerCase());
				else setUserRole('free');
			} catch {
				setUserRole('free');
			}
		};
		fetchUserRole();
	}, []);

	const isFreeUser = userRole === 'free';

	// Format currency to Rupiah
	const formatCurrency = (value: number) => {
		return `Rp ${value?.toLocaleString('id-ID')}`;
	};

	// Ambil maksimal 6 kategori terbesar dan beri warna konsisten
	const topCategories = (report?.categories || [])
		.slice()
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 6)
		.map((cat, idx) => ({ ...cat, color: categoryColors[idx % categoryColors.length] }));

	// Ubah bagian tab Tren agar LineChart dan AreaChart menggunakan yearlyData
	// Mapping yearlyData ke format yang sesuai untuk chart
	const trendChartData = yearlyData.map((item) => ({
		month: monthShortNames[(item.month - 1) % 12],
		amount: item.total,
	}));

	return (
		<DashboardLayout>
			<div className="relative w-full h-full">
				<div className={isFreeUser || forbidden ? 'relative' : ''}>
					{(isFreeUser || forbidden) && (
						<>
							<div className="absolute inset-0 z-20 pointer-events-none select-none bg-white/70 backdrop-blur-md" />
							<div className="absolute left-1/2 top-24 z-30 -translate-x-1/2 flex items-start justify-center w-full pointer-events-auto">
								<div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full flex flex-col items-center gap-6">
									{forbidden ? (
										<>
											<h2 className="text-xl font-bold text-center text-red-600">
												Akses laporan hanya untuk user Pro
											</h2>
											<p className="text-center text-gray-600">
												Silakan upgrade akun Anda untuk mengakses fitur laporan dan analisis
												keuangan.
											</p>
										</>
									) : (
										<h2 className="text-xl font-bold text-center">
											Untuk memakai fitur ini silakan upgrade ke{' '}
											<span className="text-primary">Pro</span>
										</h2>
									)}
									<button
										className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
										onClick={() => navigate('/pricing')}
									>
										Upgrade ke Pro
									</button>
								</div>
							</div>
						</>
					)}
					<div className={isFreeUser || forbidden ? 'pointer-events-none select-none' : ''}>
						{/* Page Title and Export Buttons */}
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
							<div>
								<h1 className="text-2xl font-bold tracking-tight text-gray-900">Laporan</h1>
								<p className="text-gray-600">Analisis dan pahami pola pengeluaran Anda</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<Button variant="outline" className="flex items-center">
									<FileText className="mr-2 h-4 w-4" />
									PDF Report
								</Button>
								<Button variant="outline" className="flex items-center">
									<Download className="mr-2 h-4 w-4" />
									CSV Export
								</Button>
							</div>
						</div>

						{/* Time Period Selection */}
						<Card className="mb-6">
							<CardContent className="p-4">
								<div className="flex flex-col sm:flex-row gap-4 items-end">
									<div className="w-full sm:w-1/3">
										<Label htmlFor="report-year" className="mb-2 block">
											Tahun
										</Label>
										<Select value={selectedYear} onValueChange={setSelectedYear}>
											<SelectTrigger id="report-year">
												<SelectValue placeholder="Pilih Tahun" />
											</SelectTrigger>
											<SelectContent>
												{Array.from({ length: 5 }, (_, i) => {
													const year = (new Date().getFullYear() - i).toString();
													return (
														<SelectItem key={year} value={year}>
															{year}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
									</div>
									<div className="w-full sm:w-1/3">
										<Label htmlFor="report-month" className="mb-2 block">
											Bulan
										</Label>
										<Select value={selectedMonth} onValueChange={setSelectedMonth}>
											<SelectTrigger id="report-month">
												<SelectValue placeholder="Pilih Bulan" />
											</SelectTrigger>
											<SelectContent>
												{[
													{ label: 'Januari', value: '01' },
													{ label: 'Februari', value: '02' },
													{ label: 'Maret', value: '03' },
													{ label: 'April', value: '04' },
													{ label: 'Mei', value: '05' },
													{ label: 'Juni', value: '06' },
													{ label: 'Juli', value: '07' },
													{ label: 'Agustus', value: '08' },
													{ label: 'September', value: '09' },
													{ label: 'Oktober', value: '10' },
													{ label: 'November', value: '11' },
													{ label: 'Desember', value: '12' },
												].map((month) => (
													<SelectItem key={month.value} value={month.value}>
														{month.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<Button
										className="w-full sm:w-auto bg-primary-gradient hover:opacity-90"
										onClick={fetchReport}
										disabled={loading}
									>
										Generate Laporan
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Report Tabs */}
						<Tabs
							defaultValue="overview"
							className="mb-6"
							value={selectedTab}
							onValueChange={setSelectedTab}
						>
							<div className="overflow-x-auto">
								<TabsList className="w-full inline-flex min-w-max border-b">
									<TabsTrigger value="overview" className="min-w-[140px]">
										Laporan Umum
									</TabsTrigger>
									<TabsTrigger value="categories" className="min-w-[140px]">
										Kategori
									</TabsTrigger>
									<TabsTrigger value="trends" className="min-w-[140px]">
										Tren
									</TabsTrigger>
									<TabsTrigger value="daily" className="min-w-[140px]">
										Pengeluaran Harian
									</TabsTrigger>
								</TabsList>
							</div>

							{/* Overview Tab */}
							<TabsContent value="overview" className="space-y-6">
								{loading ? (
									<div className="text-center text-gray-500">Loading...</div>
								) : error ? (
									<div className="text-center text-red-500">{error}</div>
								) : report ? (
									<>
										<Card>
											<CardHeader>
												<CardTitle>Laporan Umum</CardTitle>
												<CardDescription>
													Pola pengeluaran Anda untuk bulan {selectedMonth}/{selectedYear}
												</CardDescription>
											</CardHeader>
											<CardContent className="p-4">
												<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
													<div className="space-y-2">
														<p className="text-sm text-gray-500">Total Pengeluaran</p>
														<p className="text-3xl font-bold text-gray-900">
															{formatCurrency(report.total)}
														</p>
														<div
															className={
																report.trend >= 0
																	? 'flex items-center text-green-600 text-sm'
																	: 'flex items-center text-red-600 text-sm'
															}
														>
															{report.trend >= 0 ? (
																<TrendingUp className="mr-1 h-4 w-4" />
															) : (
																<TrendingUp className="mr-1 h-4 w-4 rotate-180" />
															)}
															<span>{(report.trend * 100).toFixed(1)}% dari bulan lalu</span>
														</div>
													</div>
													<div className="space-y-2">
														<p className="text-sm text-gray-500">Anggaran Bulanan</p>
														<p className="text-3xl font-bold text-gray-900">
															{formatCurrency(report.budget)}
														</p>
														<div className="flex items-center text-green-600 text-sm">
															<span>
																{formatCurrency(report.budget - report.total)} di bawah anggaran
															</span>
														</div>
													</div>
													<div className="space-y-2">
														<p className="text-sm text-gray-500">Rata-rata Pengeluaran Harian</p>
														<p className="text-3xl font-bold text-gray-900">
															{formatCurrency(report.averageDaily)}
														</p>
														<div className="text-sm text-gray-500">
															<span>
																{new Date(
																	parseInt(selectedYear),
																	parseInt(selectedMonth) - 1,
																	0
																).getDate()}{' '}
																hari dalam bulan ini
															</span>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Expenses vs Budget Chart */}
										<Card>
											<CardHeader>
												<CardTitle>Expenses vs. Budget</CardTitle>
												<CardDescription>
													Membandingkan pengeluaran bulanan Anda dengan anggaran Anda
												</CardDescription>
											</CardHeader>
											<CardContent className="h-80">
												<ResponsiveContainer width="100%" height="100%">
													<ReBarChart
														data={yearlyData}
														margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
													>
														<CartesianGrid strokeDasharray="3 3" vertical={false} />
														<XAxis
															dataKey="month"
															tickFormatter={(m) => monthShortNames[(Number(m) - 1) % 12]}
														/>
														<YAxis tickFormatter={formatShortRupiah} />
														<Tooltip content={CustomBarTooltip} />
														<Legend />
														<Bar
															dataKey="total"
															name="Amount"
															fill="url(#barGradient)"
															radius={[4, 4, 0, 0]}
															barSize={20}
														/>
														<Bar
															dataKey="budget"
															name="Anggaran"
															fill="#8884d8"
															radius={[4, 4, 0, 0]}
															barSize={20}
														/>
														<defs>
															<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
																<stop offset="0%" stopColor="#2E7D32" />
																<stop offset="100%" stopColor="#81C784" />
															</linearGradient>
														</defs>
													</ReBarChart>
												</ResponsiveContainer>
											</CardContent>
										</Card>

										{/* Category Breakdown and Top Expenses */}
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
											{/* Category Breakdown */}
											<Card>
												<CardHeader>
													<CardTitle>Breakdown Kategori</CardTitle>
													<CardDescription>Bagaimana pengeluaran Anda terbagi</CardDescription>
												</CardHeader>
												<CardContent className="h-80">
													<ResponsiveContainer width="100%" height="100%">
														<RePieChart>
															<Pie
																data={topCategories}
																cx="50%"
																cy="50%"
																innerRadius={60}
																outerRadius={90}
																paddingAngle={2}
																dataKey="amount"
																label={({ name, percent }) =>
																	`${name} (${(percent * 100).toFixed(0)}%)`
																}
																labelLine={false}
															>
																{topCategories.map((entry, index) => (
																	<Cell key={`cell-${index}`} fill={entry.color} />
																))}
															</Pie>
															<Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']} />
														</RePieChart>
													</ResponsiveContainer>
												</CardContent>
											</Card>

											{/* Top Expenses */}
											<Card>
												<CardHeader>
													<CardTitle>Kategori Pengeluaran Teratas</CardTitle>
													<CardDescription>Kategori pengeluaran terbesar Anda</CardDescription>
												</CardHeader>
												<CardContent>
													{topCategories.map((category, index, arr) => (
														<div
															key={index}
															className="flex items-center justify-between py-3 border-b last:border-0"
														>
															<div className="flex items-center">
																<div
																	className="w-3 h-3 rounded-full mr-3"
																	style={{ backgroundColor: category.color }}
																/>
																<span className="font-medium">{category.name}</span>
															</div>
															<div className="text-right">
																<p className="font-semibold">{formatCurrency(category.amount)}</p>
																<p className="text-xs text-gray-500">
																	{(
																		(category.amount /
																			arr.reduce((sum, cat) => sum + cat.amount, 0)) *
																		100
																	).toFixed(1)}
																	% dari total
																</p>
															</div>
														</div>
													))}
												</CardContent>
											</Card>
										</div>
									</>
								) : null}
							</TabsContent>

							{/* Categories Tab */}
							<TabsContent value="categories" className="space-y-6">
								{/* Tambahkan log untuk debug state categoryReport */}
								{/* {console.log('Rendering Categories Tab, categoryReport:', categoryReport)} */}
								<Card>
									<CardHeader>
										<CardTitle>Analisis Kategori</CardTitle>
										<CardDescription>
											Analisis detail pengeluaran Anda berdasarkan kategori
										</CardDescription>
									</CardHeader>
									<CardContent className="h-96">
										{loading ? (
											<div className="text-center text-gray-500">Loading...</div>
										) : error ? (
											<div className="text-center text-red-500">{error}</div>
										) : categoryReport.length === 0 ? (
											<div className="text-center text-gray-400">Tidak ada data kategori</div>
										) : (
											<ResponsiveContainer width="100%" height="100%">
												<ReBarChart
													data={categoryReport}
													layout="vertical"
													margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
												>
													<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
													<XAxis
														type="number"
														tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
													/>
													<YAxis type="category" dataKey="name" width={100} interval={0} />
													<Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']} />
													<Bar
														dataKey="amount"
														name="Jumlah"
														// fill="#2E7D32"
														fill="url(#barGradient)"
														radius={[0, 4, 4, 0]}
														barSize={20}
													/>
													<defs>
														<linearGradient id="barGradient" x1="1" y1="0" x2="0" y2="0">
															<stop offset="0%" stopColor="#2E7D32" />
															<stop offset="100%" stopColor="#81C784" />
														</linearGradient>
													</defs>
												</ReBarChart>
											</ResponsiveContainer>
										)}
									</CardContent>
								</Card>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<Card>
										<CardHeader>
											<CardTitle>Distribusi Kategori</CardTitle>
											<CardDescription>Perbandingan persentase pengeluaran Anda</CardDescription>
										</CardHeader>
										<CardContent className="h-80">
											{loading ? (
												<div className="text-center text-gray-500">Loading...</div>
											) : error ? (
												<div className="text-center text-red-500">{error}</div>
											) : categoryReport.length === 0 ? (
												<div className="text-center text-gray-400">Tidak ada data kategori</div>
											) : (
												<ResponsiveContainer width="100%" height="100%">
													<RePieChart>
														<Pie
															data={categoryReport}
															cx="50%"
															cy="50%"
															innerRadius={0}
															outerRadius={90}
															paddingAngle={1}
															dataKey="amount"
															label={({ name, percent }) =>
																`${name} (${(percent * 100).toFixed(0)}%)`
															}
														>
															{categoryReport.map((entry, index) => (
																<Cell
																	key={`cell-${index}`}
																	fill={categoryColors[index % categoryColors.length]}
																/>
															))}
														</Pie>
														<Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']} />
													</RePieChart>
												</ResponsiveContainer>
											)}
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Total Pengeluaran Kategori</CardTitle>
											<CardDescription>Uang yang dikeluarkan berdasarkan kategori</CardDescription>
										</CardHeader>
										<CardContent>
											{loading ? (
												<div className="text-center text-gray-500">Loading...</div>
											) : error ? (
												<div className="text-center text-red-500">{error}</div>
											) : categoryReport.length === 0 ? (
												<div className="text-center text-gray-400">Tidak ada data kategori</div>
											) : (
												<div className="space-y-4">
													{categoryReport.map((category, index) => (
														<div key={index} className="space-y-2">
															<div className="flex justify-between items-center">
																<div className="flex items-center">
																	<div
																		className="w-3 h-3 rounded-full mr-2"
																		style={{
																			backgroundColor:
																				categoryColors[index % categoryColors.length],
																		}}
																	/>
																	<span className="font-medium">{category.name}</span>
																</div>
																<span className="font-semibold">
																	{`Rp ${(category.amount ?? 0).toLocaleString('id-ID')}`}
																</span>
															</div>
															<div className="w-full bg-gray-200 rounded-full h-2.5">
																<div
																	className="h-2.5 rounded-full"
																	style={{
																		width: `${
																			// Pastikan total amount > 0 sebelum dibagi
																			(categoryReport.reduce(
																				(sum, cat) => sum + (cat.amount ?? 0),
																				0
																			) > 0
																				? ((category.amount ?? 0) /
																						categoryReport.reduce(
																							(sum, cat) => sum + (cat.amount ?? 0),
																							1
																						)) *
																				  100
																				: 0
																			).toFixed(2)
																		}%`,
																		backgroundColor: categoryColors[index % categoryColors.length],
																	}}
																></div>
															</div>
														</div>
													))}
												</div>
											)}
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							{/* Trends Tab */}
							<TabsContent value="trends" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Pola Pengeluaran</CardTitle>
										<CardDescription>
											Pola pengeluaran Anda bulanan selama 12 bulan terakhir
										</CardDescription>
									</CardHeader>
									<CardContent className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={trendChartData}
												margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" vertical={false} />
												<XAxis dataKey="month" />
												<YAxis tickFormatter={formatShortRupiah} />
												<Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']} />
												<Legend />
												<Line
													type="monotone"
													dataKey="amount"
													name="Pengeluaran Bulanan"
													stroke="#2E7D32"
													strokeWidth={3}
													dot={{ stroke: '#2E7D32', strokeWidth: 2, r: 4 }}
													activeDot={{ r: 6 }}
												/>
											</LineChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Pola Pengeluaran</CardTitle>
										<CardDescription>
											Visualisasi pengeluaran Anda sebagai grafik area
										</CardDescription>
									</CardHeader>
									<CardContent className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart
												data={trendChartData}
												margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" vertical={false} />
												<XAxis dataKey="month" />
												<YAxis tickFormatter={formatShortRupiah} />
												<Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']} />
												<Area
													type="monotone"
													dataKey="amount"
													name="Pengeluaran Bulanan"
													stroke="#2E7D32"
													fill="url(#areaGradient)"
												/>
												<defs>
													<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
														<stop offset="0%" stopColor="#2E7D32" stopOpacity={0.8} />
														<stop offset="95%" stopColor="#2E7D32" stopOpacity={0.1} />
													</linearGradient>
												</defs>
											</AreaChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Daily Spending Tab */}
							<TabsContent value="daily" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Pengeluaran Harian</CardTitle>
										<CardDescription>
											Pengeluaran harian Anda untuk bulan{' '}
											{reportMonths.find((m) => m.value === selectedMonth)?.label} {selectedYear}
										</CardDescription>
									</CardHeader>
									<CardContent className="h-96">
										{dailyLoading ? (
											<div className="text-center text-gray-500">Loading...</div>
										) : dailyError ? (
											<div className="text-center text-red-500">{dailyError}</div>
										) : (
											<ResponsiveContainer width="100%" height="100%">
												<ReBarChart
													data={dailyData}
													margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
												>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis
														dataKey="day"
														label={{ value: 'Hari Bulan', position: 'insideBottom', offset: -5 }}
													/>
													<YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
													<Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']} />
													<Bar
														dataKey="amount"
														name="Pengeluaran Harian"
														fill="url(#barGradient)"
														radius={[4, 4, 0, 0]}
														barSize={8}
													/>
													<defs>
														<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
															<stop offset="0%" stopColor="#2E7D32" />
															<stop offset="100%" stopColor="#81C784" />
														</linearGradient>
													</defs>
												</ReBarChart>
											</ResponsiveContainer>
										)}
									</CardContent>
								</Card>

								{/* Card Analitik Harian */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{/* Hari Pengeluaran Tertinggi */}
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium text-gray-500">
												Hari Pengeluaran Tertinggi
											</CardTitle>
										</CardHeader>
										<CardContent>
											{dailyLoading ? (
												<span className="text-gray-400">Loading...</span>
											) : dailyError ? (
												<span className="text-red-500">{dailyError}</span>
											) : dailyData.length === 0 ? (
												<span className="text-gray-400">Tidak ada data</span>
											) : (
												(() => {
													const max = dailyData.reduce(
														(prev, curr) => (curr.amount > prev.amount ? curr : prev),
														{ day: 0, amount: 0, categories: [] }
													);
													if (max.amount === 0)
														return (
															<span className="text-gray-400">Tidak ada pengeluaran bulan ini</span>
														);
													// Cari kategori dengan nominal terbesar pada hari tsb
													let topCat = null;
													if (max.categories && max.categories.length > 0) {
														const maxCatAmount = Math.max(...max.categories.map((c) => c.amount));
														topCat = max.categories.find((c) => c.amount === maxCatAmount);
													}
													return (
														<div className="flex flex-col">
															<span className="text-2xl font-bold text-gray-900">
																{formatDayLabel(max.day, selectedMonth, selectedYear)}
															</span>
															<span className="text-3xl font-bold text-primary">
																{formatCurrency(max.amount)}
															</span>
															{topCat && (
																<span className="text-sm text-gray-600 mt-1">
																	Pengeluaran Terbesar Kategori: <b>{topCat.category}</b>
																</span>
															)}
														</div>
													);
												})()
											)}
										</CardContent>
									</Card>
									{/* Hari Pengeluaran Terendah */}
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium text-gray-500">
												Hari Pengeluaran Terendah
											</CardTitle>
										</CardHeader>
										<CardContent>
											{dailyLoading ? (
												<span className="text-gray-400">Loading...</span>
											) : dailyError ? (
												<span className="text-red-500">{dailyError}</span>
											) : dailyData.length === 0 ? (
												<span className="text-gray-400">Tidak ada data</span>
											) : (
												(() => {
													const min = dailyData
														.filter((d) => d.amount > 0)
														.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev), {
															day: 0,
															amount: Infinity,
															categories: [],
														});
													if (!min || min.amount === Infinity)
														return (
															<span className="text-gray-400">
																Tidak ada hari dengan pengeluaran
															</span>
														);
													// Cari kategori dengan nominal terbesar pada hari tsb (atau terkecil, jika ingin kategori terkecil pada hari tsb)
													let minCat = null;
													if (min.categories && min.categories.length > 0) {
														const maxCatAmount = Math.max(...min.categories.map((c) => c.amount));
														minCat = min.categories.find((c) => c.amount === maxCatAmount);
													}
													return (
														<div className="flex flex-col">
															<span className="text-2xl font-bold text-gray-900">
																{formatDayLabel(min.day, selectedMonth, selectedYear)}
															</span>
															<span className="text-3xl font-bold text-green-600">
																{formatCurrency(min.amount)}
															</span>
															{minCat && (
																<span className="text-sm text-gray-600 mt-1">
																	Pengeluaran Terendah Kategori: <b>{minCat.category}</b>
																</span>
															)}
														</div>
													);
												})()
											)}
										</CardContent>
									</Card>
									{/* Hari Tanpa Pengeluaran */}
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium text-gray-500">
												Hari Tanpa Pengeluaran
											</CardTitle>
										</CardHeader>
										<CardContent>
											{dailyLoading ? (
												<span className="text-gray-400">Loading...</span>
											) : dailyError ? (
												<span className="text-red-500">{dailyError}</span>
											) : dailyData.length === 0 ? (
												<span className="text-gray-400">Tidak ada data</span>
											) : (
												(() => {
													const zeroDays = dailyData.filter((d) => d.amount === 0).length;
													return (
														<div className="flex flex-col">
															<span className="text-3xl font-bold text-gray-900">{zeroDays}</span>
															<p className="text-sm text-gray-500 mt-1">
																Hari dengan pengeluaran nol
															</p>
															{zeroDays > 0 && (
																<div className="flex items-center text-green-600 text-sm mt-2">
																	<TrendingUp className="mr-1 h-4 w-4" />
																	<span>{zeroDays} hari tanpa pengeluaran</span>
																</div>
															)}
														</div>
													);
												})()
											)}
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Reports;
