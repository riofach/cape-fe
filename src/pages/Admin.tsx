import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import UserManagementTab from '@/components/admin/UserManagementTab';
import PaymentProofTab from '@/components/admin/PaymentProofTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

// Define types to match component expectations
type UserRole = 'free' | 'pro' | 'admin';
type PaymentStatus = 'pending' | 'approved' | 'rejected';

// Mock data for users with proper typing
const mockUsers = [
	{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'free' as UserRole },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'pro' as UserRole },
	{ id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' as UserRole },
];

type HelpRequest = {
	id: string;
	name: string;
	email: string;
	message: string;
	date: string;
	status: string;
};

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

// Tambahkan tipe untuk response support dari backend
type SupportApi = {
	_id: string;
	userId?: { username?: string; email?: string } | null;
	message: string;
	createdAt?: string;
	status?: string;
};

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [userError, setUserError] = useState<string | null>(null);
	const [payments, setPayments] = useState<PaymentProof[]>([]);
	const [loadingPayments, setLoadingPayments] = useState(true);
	const [paymentError, setPaymentError] = useState<string | null>(null);
	const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
	const [loadingHelp, setLoadingHelp] = useState(true);
	const [helpError, setHelpError] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState<string | null>(null);
	const [nextStatus, setNextStatus] = useState<'pending' | 'resolved'>('resolved');
	const [helpStatus, setHelpStatus] = useState<string>('all');
	const [helpSearch, setHelpSearch] = useState<string>('');
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

	// Fetch help requests
	const fetchHelpRequests = useCallback(async () => {
		setLoadingHelp(true);
		setHelpError(null);
		try {
			const token = localStorage.getItem('token');
			let url = '/api/support';
			const params = [];
			if (helpStatus !== 'all') params.push(`status=${helpStatus}`);
			if (helpSearch) params.push(`q=${encodeURIComponent(helpSearch)}`);
			if (params.length > 0) url += '?' + params.join('&');
			const res = await fetch(url, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Gagal mengambil data bantuan');
			setHelpRequests(
				(data.data as SupportApi[]).map((req) => ({
					id: req._id,
					name: req.userId?.username || 'Unknown',
					email: req.userId?.email || '-',
					message: req.message,
					date: req.createdAt
						? new Date(req.createdAt).toLocaleDateString('id-ID', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
						  })
						: '-',
					status: req.status || 'pending',
				}))
			);
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			setHelpError(errorMsg);
		} finally {
			setLoadingHelp(false);
		}
	}, [helpStatus, helpSearch]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	useEffect(() => {
		fetchPayments();
	}, [fetchPayments]);

	useEffect(() => {
		fetchHelpRequests();
	}, [fetchHelpRequests]);

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

	const handleToggleStatus = async (id: string, status: string) => {
		setUpdatingId(id);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`/api/support/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Gagal update status bantuan');
			toast({
				title: 'Status Updated',
				description: 'Status bantuan berhasil diubah.',
			});
			fetchHelpRequests();
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			toast({
				title: 'Gagal update status bantuan',
				description: errorMsg,
				variant: 'destructive',
			});
		} finally {
			setUpdatingId(null);
			setDialogOpen(null);
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
								<div className="flex gap-4 items-center mt-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
										<Input
											placeholder="Search help requests..."
											value={helpSearch}
											onChange={(e) => setHelpSearch(e.target.value)}
											className="pl-9"
										/>
									</div>
									<div className="flex items-center gap-2">
										<Filter className="h-4 w-4 text-gray-500" />
										<Select value={helpStatus} onValueChange={setHelpStatus}>
											<SelectTrigger className="w-32">
												<SelectValue placeholder="Filter status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Status</SelectItem>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="resolved">Resolved</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{loadingHelp ? (
									<div>Loading help requests...</div>
								) : helpError ? (
									<div className="text-red-600">{helpError}</div>
								) : (
									<div className="space-y-4">
										{helpRequests.length === 0 ? (
											<div>Tidak ada permintaan bantuan.</div>
										) : (
											helpRequests.map((request) => {
												const isPending = request.status === 'pending';
												const targetStatus = isPending ? 'resolved' : 'pending';
												return (
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
																			: request.status === 'success' ||
																			  request.status === 'resolved'
																			? 'bg-green-100 text-green-800'
																			: 'bg-gray-100 text-gray-800'
																	}`}
																>
																	{request.status}
																</span>
																<AlertDialog
																	open={dialogOpen === request.id}
																	onOpenChange={(open) => setDialogOpen(open ? request.id : null)}
																>
																	<AlertDialogTrigger asChild>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => {
																				setDialogOpen(request.id);
																				setNextStatus(targetStatus);
																			}}
																			disabled={updatingId === request.id}
																		>
																			{updatingId === request.id ? 'Updating...' : 'Toggle Status'}
																		</Button>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle>Ubah status bantuan?</AlertDialogTitle>
																			<AlertDialogDescription>
																				Apakah Anda yakin ingin mengubah status bantuan ini menjadi{' '}
																				<b>{targetStatus}</b>?
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>Batal</AlertDialogCancel>
																			<AlertDialogAction
																				onClick={() => handleToggleStatus(request.id, targetStatus)}
																				disabled={updatingId === request.id}
																			>
																				Ya, Ubah Status
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															</div>
														</div>
														<p className="text-sm">{request.message}</p>
														<p className="text-xs text-gray-500">Submitted on: {request.date}</p>
													</div>
												);
											})
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
};

export default Admin;
