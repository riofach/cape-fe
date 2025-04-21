import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import UserManagementTab from '@/components/admin/UserManagementTab';
import PaymentProofTab from '@/components/admin/PaymentProofTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define types to match component expectations
type UserRole = 'free' | 'pro' | 'admin';
type PaymentStatus = 'pending' | 'approved' | 'rejected';

// Mock data for users with proper typing
const mockUsers = [
	{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'free' as UserRole },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'pro' as UserRole },
	{ id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' as UserRole },
];

// Mock data for payment proofs with proper typing
const mockPaymentProofs = [
	{
		id: 1,
		userName: 'John Doe',
		email: 'john@example.com',
		date: '2025-04-16',
		amount: 10000,
		status: 'pending' as PaymentStatus,
		proofUrl: 'https://example.com/proof1.jpg',
	},
	{
		id: 2,
		userName: 'Jane Smith',
		email: 'jane@example.com',
		date: '2025-04-15',
		amount: 10000,
		status: 'approved' as PaymentStatus,
		proofUrl: 'https://example.com/proof2.jpg',
	},
];

type HelpRequest = {
	id: number;
	name: string;
	email: string;
	message: string;
	date: string;
	status: 'pending' | 'resolved';
};

const mockHelpRequests: HelpRequest[] = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john@example.com',
		message: 'I need help with expense tracking',
		date: '2025-04-20',
		status: 'pending',
	},
	{
		id: 2,
		name: 'Jane Smith',
		email: 'jane@example.com',
		message: 'Having issues with the income page',
		date: '2025-04-19',
		status: 'resolved',
	},
];

const Admin = () => {
	const [users, setUsers] = useState(mockUsers);
	const [payments, setPayments] = useState(mockPaymentProofs);
	const [helpRequests, setHelpRequests] = useState(mockHelpRequests);

	const handleRoleChange = (userId: number, newRole: UserRole) => {
		setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
		toast({
			title: 'Role Updated',
			description: 'User role has been successfully updated.',
		});
	};

	const handlePaymentStatus = (paymentId: number, newStatus: PaymentStatus) => {
		setPayments(
			payments.map((payment) =>
				payment.id === paymentId ? { ...payment, status: newStatus } : payment
			)
		);
		toast({
			title: 'Payment Status Updated',
			description: `Payment has been ${newStatus}.`,
		});
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<h1 className="text-2xl font-bold">Admin Dashboard</h1>

				<Tabs defaultValue="users">
					<TabsList>
						<TabsTrigger value="users">User Management</TabsTrigger>
						<TabsTrigger value="payments">Payment Proofs</TabsTrigger>
						<TabsTrigger value="help">Help & Support</TabsTrigger>
					</TabsList>

					<TabsContent value="users" className="mt-4">
						<UserManagementTab users={users} onRoleChange={handleRoleChange} />
					</TabsContent>

					<TabsContent value="payments" className="mt-4">
						<PaymentProofTab payments={payments} onStatusChange={handlePaymentStatus} />
					</TabsContent>

					<TabsContent value="help" className="mt-4">
						<Card>
							<CardHeader>
								<CardTitle>Help & Support Requests</CardTitle>
								<CardDescription>View and manage user help requests</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{helpRequests.map((request) => (
										<div key={request.id} className="border rounded-lg p-4 space-y-2">
											<div className="flex items-center justify-between">
												<div>
													<h3 className="font-medium">{request.name}</h3>
													<p className="text-sm text-gray-500">{request.email}</p>
												</div>
												<div className="flex items-center gap-2">
													<span
														className={`text-sm px-2 py-1 rounded-full ${
															request.status === 'pending'
																? 'bg-yellow-100 text-yellow-800'
																: 'bg-green-100 text-green-800'
														}`}
													>
														{request.status}
													</span>
													<Button variant="outline" size="sm" disabled>
														Toggle Status
													</Button>
												</div>
											</div>
											<p className="text-sm">{request.message}</p>
											<p className="text-xs text-gray-500">Submitted on: {request.date}</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
};

export default Admin;
