import { useState } from 'react';
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
import { CalendarIcon, PlusCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

const Income = () => {
	const [date, setDate] = useState<Date>();

	// Mock income data
	const incomeData = [
		{
			id: 1,
			date: '2025-04-10',
			category: 'Salary',
			amount: 2500000,
			description: 'Monthly salary',
		},
		{
			id: 2,
			date: '2025-04-05',
			category: 'Freelance',
			amount: 500000,
			description: 'Website development project',
		},
		{
			id: 3,
			date: '2025-04-01',
			category: 'Investments',
			amount: 350000,
			description: 'Dividend payment',
		},
		{
			id: 4,
			date: '2025-03-25',
			category: 'Cashback',
			amount: 75000,
			description: 'Credit card cashback',
		},
	];

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
					<h1 className="text-2xl font-bold">Income Tracking</h1>
					<Button>
						<PlusCircle className="mr-2 h-4 w-4" />
						Add New Income
					</Button>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Total Income
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">Rp3,425,000</div>
							<p className="text-xs text-green-600 mt-1">+15% from last month</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Average per Entry
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">Rp856,250</div>
							<p className="text-xs text-muted-foreground mt-1">Based on 4 entries</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Highest Income
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">Rp2,500,000</div>
							<p className="text-xs text-muted-foreground mt-1">From Salary</p>
						</CardContent>
					</Card>
				</div>

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
								<Input id="amount" placeholder="0" type="number" />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="category">Category</Label>
								<Select>
									<SelectTrigger id="category">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="salary">Salary</SelectItem>
										<SelectItem value="freelance">Freelance</SelectItem>
										<SelectItem value="investments">Investments</SelectItem>
										<SelectItem value="business">Business</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label>Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="outline" className="w-full justify-start text-left">
											{date ? format(date, 'PPP') : 'Select date'}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
									</PopoverContent>
								</Popover>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="description">Description</Label>
								<Input id="description" placeholder="Add details..." />
							</div>
						</div>
					</CardContent>
					<CardFooter className="justify-between space-x-2">
						<Button variant="ghost">Reset</Button>
						<Button>Save Income</Button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center">
						<div className="space-y-1.5">
							<CardTitle>Income History</CardTitle>
							<CardDescription>View and manage your recorded income.</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search incomes..." className="h-9" />
						</div>
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4">
								{incomeData.map((income) => (
									<div
										key={income.id}
										className="flex items-center justify-between rounded-lg border p-4"
									>
										<div className="space-y-1">
											<p className="text-sm font-medium">{income.category}</p>
											<p className="text-xs text-muted-foreground">{income.date}</p>
											<p className="text-xs text-muted-foreground">{income.description}</p>
										</div>
										<div className="flex items-center gap-2">
											<p className="text-sm font-bold text-green-600">
												+Rp{income.amount.toLocaleString()}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
};

export default Income;
