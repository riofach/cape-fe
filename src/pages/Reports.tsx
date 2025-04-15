
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
  { month: 'Jan', amount: 1200, budget: 1500 },
  { month: 'Feb', amount: 980, budget: 1500 },
  { month: 'Mar', amount: 1600, budget: 1500 },
  { month: 'Apr', amount: 1458, budget: 1500 },
  { month: 'May', amount: 1100, budget: 1500 },
  { month: 'Jun', amount: 1250, budget: 1500 },
  { month: 'Jul', amount: 1420, budget: 1500 },
  { month: 'Aug', amount: 1350, budget: 1500 },
  { month: 'Sep', amount: 1190, budget: 1500 },
  { month: 'Oct', amount: 1550, budget: 1500 },
  { month: 'Nov', amount: 1670, budget: 1500 },
  { month: 'Dec', amount: 1950, budget: 1500 },
];

// Category data
const categoryData = [
  { name: 'Food', value: 4200, color: '#0088FE' },
  { name: 'Housing', value: 8400, color: '#00C49F' },
  { name: 'Transportation', value: 2900, color: '#FFBB28' },
  { name: 'Entertainment', value: 1800, color: '#FF8042' },
  { name: 'Utilities', value: 2200, color: '#8884d8' },
  { name: 'Healthcare', value: 1100, color: '#82ca9d' },
  { name: 'Others', value: 1400, color: '#ffc658' },
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
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('04'); // April
  const [selectedTab, setSelectedTab] = useState('overview');

  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <DashboardLayout>
      {/* Page Title and Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze and understand your spending patterns</p>
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
              <Label htmlFor="report-year" className="mb-2 block">Year</Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger id="report-year">
                  <SelectValue placeholder="Select Year" />
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
              <Label htmlFor="report-month" className="mb-2 block">Month</Label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger id="report-month">
                  <SelectValue placeholder="Select Month" />
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
              Generate Report
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="daily">Daily Spending</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                Your spending patterns for {reportMonths.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">$1,458.65</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>3.2% from last month</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Monthly Budget</p>
                  <p className="text-3xl font-bold text-gray-900">$1,500.00</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <span>$41.35 under budget</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Average Daily Spend</p>
                  <p className="text-3xl font-bold text-gray-900">$47.05</p>
                  <div className="text-sm text-gray-500">
                    <span>31 days in this month</span>
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
                Comparing your monthly spending with your budget
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
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Actual Spending" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar 
                    dataKey="budget" 
                    name="Budget" 
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
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>How your expenses are distributed</CardDescription>
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
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>Your highest expense categories</CardDescription>
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
                      <p className="font-semibold">${category.value.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {(category.value / categoryData.reduce((sum, cat) => sum + cat.value, 0) * 100).toFixed(1)}% of total
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
              <CardTitle>Category Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of your spending by category
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
                  <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar 
                    dataKey="value" 
                    name="Amount" 
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
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Percentage breakdown of your expenses</CardDescription>
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
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Totals</CardTitle>
                <CardDescription>Detailed amounts by category</CardDescription>
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
                        <span className="font-semibold">${category.value.toFixed(2)}</span>
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
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>
                Your monthly spending patterns over the last 12 months
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
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    name="Monthly Expenses" 
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
              <CardTitle>Expense Patterns</CardTitle>
              <CardDescription>
                Visualizing your spending as an area chart
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
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    name="Monthly Expenses" 
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
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>
                Your day-by-day expenses for {reportMonths.find(m => m.value === selectedMonth)?.label} {selectedYear}
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
                    label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar 
                    dataKey="amount" 
                    name="Daily Spend" 
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
                  Highest Spending Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    April 20
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    $149.99
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Main expense: Online course subscription
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Lowest Spending Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    April 3
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    $12.50
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Main expense: Coffee and snack
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  No-Spend Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900">4</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Days with zero expenses
                  </p>
                  <div className="flex items-center text-green-600 text-sm mt-2">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>2 more than last month</span>
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
                <CardTitle>Savings Opportunities</CardTitle>
                <CardDescription>
                  Areas where you could potentially save money
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
                          Food expenses are above average
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Your food spending is 23% higher than your 6-month average. Consider meal planning to reduce costs.
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
                          Transportation costs are down
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Your transportation expenses decreased by 15% compared to last month. Keep up the good work!
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
                          Entertainment spending is high
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Entertainment expenses are 35% over your budget. Look for free or lower-cost alternatives.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
                <CardDescription>
                  How this month compares to previous periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. Last Month</span>
                      <span className="text-sm font-medium text-red-600">+$78.45 (5.7%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '57%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. 3 Month Average</span>
                      <span className="text-sm font-medium text-green-600">-$42.20 (2.8%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-green-500" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. 6 Month Average</span>
                      <span className="text-sm font-medium text-red-600">+$103.55 (7.6%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '76%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">vs. Same Month Last Year</span>
                      <span className="text-sm font-medium text-red-600">+$215.30 (17.3%)</span>
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
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Tips to improve your financial health based on your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Create a food budget</h4>
                    <p className="text-gray-600 mt-1">
                      Set a weekly food budget and plan your meals in advance. This could help you save approximately $80-$120 per month based on your current spending patterns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Review subscription services</h4>
                    <p className="text-gray-600 mt-1">
                      You're spending $45 monthly on potentially unused subscriptions. Consider reviewing and canceling services you don't regularly use.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Implement a 24-hour rule</h4>
                    <p className="text-gray-600 mt-1">
                      For non-essential purchases over $50, wait 24 hours before buying. This simple rule could reduce impulse purchases that we've identified in your spending patterns.
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
