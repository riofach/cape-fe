import { PieChart, Smartphone } from 'lucide-react';

const ExpensePreviewCard = () => {
	return (
		<div className="flex justify-center lg:justify-end">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
				<div className="p-6 bg-primary-gradient text-white">
					<h2 className="text-xl font-semibold mb-4">
						{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
					</h2>
					<div className="flex justify-between items-center">
						<div>
							<p className="text-white/80 text-sm">Total Expenses</p>
							<p className="text-3xl font-bold">Rp 5.000.000</p>
						</div>
						<PieChart className="h-16 w-16" />
					</div>
				</div>
				<div className="p-6 space-y-6">
					<div>
						<h3 className="font-medium text-gray-900">Recent Expenses</h3>
						<div className="mt-3 space-y-3">
							<ExpenseItem
								category="Electronics"
								date="Apr 12, 2025"
								amount="Rp 2.500.000"
								bgColor="bg-blue-100"
								textColor="text-blue-600"
							/>
							<ExpenseItem
								category="Groceries"
								date="Apr 10, 2025"
								amount="Rp 1.500.000"
								bgColor="bg-green-100"
								textColor="text-green-600"
							/>
							<ExpenseItem
								category="Entertainment"
								date="Apr 8, 2025"
								amount="Rp 1.000.000"
								bgColor="bg-purple-100"
								textColor="text-purple-600"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

interface ExpenseItemProps {
	category: string;
	date: string;
	amount: string;
	bgColor: string;
	textColor: string;
}

const ExpenseItem = ({ category, date, amount, bgColor, textColor }: ExpenseItemProps) => (
	<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
		<div className="flex items-center">
			<div
				className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}
			>
				<Smartphone className="h-5 w-5" />
			</div>
			<div className="ml-3">
				<p className="text-sm font-medium text-gray-900">{category}</p>
				<p className="text-xs text-gray-500">{date}</p>
			</div>
		</div>
		<span className="font-medium text-gray-900">{amount}</span>
	</div>
);

export default ExpensePreviewCard;
