import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

type UserApi = { _id: string; username: string; email: string; role: UserRole };

type PaymentProof = {
	id: string;
	userName: string;
	email: string;
	date: string;
	amount: number;
	status: PaymentStatus;
	proofUrl: string;
};

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [userError, setUserError] = useState<string | null>(null);
	const [payments, setPayments] = useState<PaymentProof[]>([]);
	const [loadingPayments, setLoadingPayments] = useState(true);
	const [paymentError, setPaymentError] = useState<string | null>(null);
	const [helpRequests, setHelpRequests] = useState(mockHelpRequests);
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const navigate = useNavigate();

	const fetchUsers = useCallback(async () => {
		setLoadingUsers(true);
		setUserError(null);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch('/api/auth/users', {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Gagal mengambil data user');
			setUsers(
				data.data.map((u: UserApi) => ({
					id: u._id,
					name: u.username,
					email: u.email,
					role: u.role,
				}))
			);
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			setUserError(errorMsg);
		} finally {
			setLoadingUsers(false);
		}
	}, []);

	const fetchPayments = useCallback(async () => {
		setLoadingPayments(true);
		setPaymentError(null);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch('/api/payments/all', {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Gagal mengambil data pembayaran');
			setPayments(data.data);
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			setPaymentError(errorMsg);
		} finally {
			setLoadingPayments(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	useEffect(() => {
		fetchPayments();
	}, [fetchPayments]);

	useEffect(() => {
		// Cek role user dari localStorage/token atau fetch profile
		const checkRole = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				setIsAdmin(false);
				navigate('/');
				return;
			}
			try {
				const res = await fetch('/api/auth/profile', {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await res.json();
				if (res.ok && data?.data?.role === 'admin') {
					setIsAdmin(true);
				} else {
					setIsAdmin(false);
					navigate('/');
				}
			} catch {
				setIsAdmin(false);
				navigate('/');
			}
		};
		checkRole();
	}, [navigate]);

	if (isAdmin === null) return <div>Loading...</div>;
	if (!isAdmin) return null;

	const handleRoleChange = async (userId: string, newRole: UserRole) => {
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`/api/auth/users/${userId}/role`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ role: newRole }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Gagal update role user');
			setUsers((prev) =>
				prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
			);
			toast({
				title: 'Role Updated',
				description: 'User role has been successfully updated.',
			});
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			toast({
				title: 'Gagal update role user',
				description: errorMsg,
				variant: 'destructive',
			});
		}
	};

	const handlePaymentStatus = async (paymentId: string, newStatus: PaymentStatus) => {
		try {
			const token = localStorage.getItem('token');
			const res = await fetch('/api/payments/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ paymentId, status: newStatus }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Gagal update status pembayaran');
			toast({
				title: 'Payment Status Updated',
				description: `Payment has been ${newStatus}.`,
			});
			// Jika approved, refresh data agar role user juga terupdate
			fetchPayments();
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			toast({
				title: 'Gagal update status pembayaran',
				description: errorMsg,
				variant: 'destructive',
			});
		}
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
						{loadingUsers ? (
							<div>Loading users...</div>
						) : userError ? (
							<div className="text-red-600">{userError}</div>
						) : (
							<UserManagementTab users={users} onRoleChange={handleRoleChange} />
						)}
					</TabsContent>

					<TabsContent value="payments" className="mt-4">
						{loadingPayments ? (
							<div>Loading payments...</div>
						) : paymentError ? (
							<div className="text-red-600">{paymentError}</div>
						) : (
							<PaymentProofTab payments={payments} onStatusChange={handlePaymentStatus} />
						)}
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
