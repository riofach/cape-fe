
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for the charts
const monthlyExpenses = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 980 },
  { month: 'Mar', amount: 1600 },
  { month: 'Apr', amount: 1458 },
  { month: 'May', amount: 1100 },
  { month: 'Jun', amount: 1250 },
];

const categoryData = [
  { name: 'Food', value: 400, color: '#0088FE' },
  { name: 'Housing', value: 600, color: '#00C49F' },
  { name: 'Transportation', value: 300, color: '#FFBB28' },
  { name: 'Entertainment', value: 200, color: '#FF8042' },
  { name: 'Utilities', value: 150, color: '#8884d8' },
  { name: 'Others', value: 100, color: '#82ca9d' },
];

// Mock data for recent transactions
const recentTransactions = [
  {
    id: 1,
    description: "Grocery shopping",
    amount: 120.50,
    date: "2025-04-12",
    category: "Food",
    trend: "up"
  },
  {
    id: 2,
    description: "Monthly rent",
    amount: 850.00,
    date: "2025-04-01",
    category: "Housing",
    trend: "same"
  },
  {
    id: 3,
    description: "Electricity bill",
    amount: 75.20,
    date: "2025-04-05",
    category: "Utilities",
    trend: "down"
  },
  {
    id: 4,
    description: "Restaurant dinner",
    amount: 65.30,
    date: "2025-04-10",
    category: "Food",
    trend: "up"
  },
  {
    id: 5,
    description: "Movie tickets",
    amount: 32.00,
    date: "2025-04-08",
    category: "Entertainment",
    trend: "same"
  }
];

// Format Rupiah currency
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const Dashboard = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);

  const totalExpensesThisMonth = 1458650;
  const percentageChange = 5.2;
  const isIncreased = percentageChange > 0;
  const averageDailySpending = Math.round(totalExpensesThisMonth / 31);

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your personal finances</p>
        </div>
        <Button
          onClick={() => setShowAddExpense(true)}
          className="bg-primary-gradient hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

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
                <span className="text-2xl font-bold">{formatRupiah(totalExpensesThisMonth)}</span>
              </div>
              <div className={`flex items-center ${isIncreased ? 'text-red-500' : 'text-green-500'}`}>
                {isIncreased ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(percentageChange)}%</span>
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
            <p className="text-xs text-gray-500 mt-1">31 days in this month</p>
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
                <span className="text-2xl font-bold">Housing</span>
                <p className="text-xs text-gray-500 mt-1">41% of total expenses</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#00C49F] flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
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
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `Rp${value/1000}K`}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => [`Rp${value.toLocaleString('id-ID')}`, 'Amount']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
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
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-600">{category.name}</span>
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
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' · '}
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{formatRupiah(transaction.amount * 1000)}</span>
                  <div className="ml-2">
                    {transaction.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : transaction.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
