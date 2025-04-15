import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Download, 
  FileText, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  FileDown 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
  Area
} from "recharts";

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

// Trend data for last 12 months
const trendData = monthlyData.map(item => ({
  month: item.month,
  amount: item.amount
}));

// Daily spending data for the current month
const dailySpendingData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  amount: Math.floor(Math.random() * 150) + 10
}));

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

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('04'); // April
  const [selectedTab, setSelectedTab] = useState('overview');

  // Format currency to Rupiah
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <DashboardLayout>
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
              <Label htmlFor="report-year" className="mb-2 block">Tahun</Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger id="report-year">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {reportYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/3">
              <Label htmlFor="report-month" className="mb-2 block">Bulan</Label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger id="report-month">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {reportMonths.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full sm:w-auto bg-primary-gradient hover:opacity-90">
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
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full mb-4">
          <TabsTrigger value="overview">Laporan Umum</TabsTrigger>
          <TabsTrigger value="categories">Kategori</TabsTrigger>
          <TabsTrigger value="trends">Tren</TabsTrigger>
          <TabsTrigger value="daily">Pengeluaran Harian</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Umum</CardTitle>
              <CardDescription>
                Pola pengeluaran Anda untuk bulan {reportMonths.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Pengeluaran</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(21_879_750)}
                  </p>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>3.2% dari bulan lalu</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Anggaran Bulanan</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(22_500_000)}
                  </p>
                  <div className="flex items-center text-green-600 text-sm">
                    <span>Rp 413.50 dibawah anggaran</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Rata-rata Pengeluaran Harian</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(47_05)}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span>31 hari dalam bulan ini</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Expenses vs Budget Chart */}
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
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Pengeluaran Aktual" 
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
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
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
                {topSpendingData.map((category, index) => (
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
                      <p className="font-semibold">{formatCurrency(category.value)}</p>
                      <p className="text-xs text-gray-500">
                        {(category.value / categoryData.reduce((sum, cat) => sum + cat.value, 0) * 100).toFixed(1)}% dari total
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Kategori</CardTitle>
              <CardDescription>
                Analisis detail pengeluaran Anda berdasarkan kategori
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
                  <Bar 
                    dataKey="value" 
                    name="Jumlah" 
                    fill="url(#barGradient)" 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kategori</CardTitle>
                <CardDescription>Perbandingan persentase pengeluaran Anda</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={90}
                      paddingAngle={1}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Pengeluaran Kategori</CardTitle>
                <CardDescription>Uang yang dikeluarkan berdasarkan kategori</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(category.value)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${(category.value / categoryData.reduce((sum, cat) => sum + cat.value, 0) * 100)}%`,
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
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
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
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
                Pengeluaran harian Anda untuk bulan {reportMonths.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={dailySpendingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    label={{ value: 'Hari Bulan', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                  <Tooltip formatter={(value) => [`Rp ${value}`, 'Amount']}/>
                  <Bar 
                    dataKey="amount" 
                    name="Pengeluaran Harian" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]}
                    barSize={8}
                  />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Hari Pengeluaran Tertinggi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    20 April
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(149_99)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Pengeluaran utama: Paket kursus online
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Hari Pengeluaran Terendah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    3 April
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(12_50)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Pengeluaran utama: Kopi dan makanan
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Hari Tanpa Pengeluaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900">4</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Hari dengan pengeluaran nol
                  </p>
                  <div className="flex items-center text-green-600 text-sm mt-2">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>2 lebih dari bulan lalu</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Opportunitas Penyimpanan</CardTitle>
                <CardDescription>
                  Area di mana Anda mungkin bisa menyimpan uang lebih banyak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 flex-shrink-0">
                        <FileDown className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Pengeluaran makanan lebih tinggi dari rata-rata
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pengeluaran makanan Anda 23% lebih tinggi dari rata-rata 6 bulan terakhir. Cobalah planing makanan untuk mengurangi biaya.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Pengeluaran transportasi turun
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pengeluaran transportasi Anda turun 15% dibandingkan bulan lalu. Tetapkan hal-hal ini!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 flex-shrink-0">
                        <BarChart className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Pengeluaran hiburan tinggi
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pengeluaran hiburan Anda 35% di atas anggaran Anda. Cari alternatif yang lebih murah atau gratis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Bulanan</CardTitle>
                <CardDescription>
                  Bagaimana bulan ini berbandingkan dengan periode sebelumnya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. Bulan Lalu</span>
                      <span className="text-sm font-medium text-red-600">Rp 78.45 (+5.7%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '57%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. Rata-rata 3 Bulan</span>
                      <span className="text-sm font-medium text-green-600">Rp 42.20 (-2.8%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-green-500" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. Rata-rata 6 Bulan</span>
                      <span className="text-sm font-medium text-red-600">Rp 103.55 (+7.6%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '76%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. Bulan Sama Tahun Lalu</span>
                      <span className="text-sm font-medium text-red-600">Rp 215.30 (+17.3%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rekomendasi Pribadi</CardTitle>
              <CardDescription>
                Tips untuk meningkatkan kesehatan finansial Anda berdasarkan pola pengeluaran Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Buat anggaran makanan</h4>
                    <p className="text-gray-600 mt-1">
                      Buat anggaran mingguan makanan dan jadwalkan makanan Anda sebelumnya. Ini bisa membantu Anda menyimpan sekitar Rp 80-120 per bulan berdasarkan pola pengeluaran Anda saat ini.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Periksa layanan pendaftaran</h4>
                    <p className="text-gray-600 mt-1">
                      Anda mengeluarkan Rp 45 bulanan pada layanan pendaftaran yang mungkin tidak sering digunakan. Cobalah memeriksa dan membatalkan layanan yang tidak sering digunakan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Implementasikan aturan 24 jam</h4>
                    <p className="text-gray-600 mt-1">
                      Untuk pembelian non-essential yang lebih dari Rp 50, tunggu 24 jam sebelum membeli. Aturan ini bisa membantu mengurangi pembelian impulsive yang kita temukan dalam pola pengeluaran Anda.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
