import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/utils/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type PaymentHistory = {
	id: string;
	date: string;
	amount: string;
	plan: string;
	status: string;
	proofImage: string;
};

type PaymentApi = {
	_id?: string;
	id?: string;
	paymentDate?: string;
	date?: string;
	amount?: number;
	notes?: string;
	status: string;
	proofImageUrl?: string;
	proofUrl?: string;
};

type SupportHistory = {
	id: string;
	date: string;
	message: string;
	status: string;
};

const History = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
	const [loadingPayment, setLoadingPayment] = useState(true);
	const [paymentError, setPaymentError] = useState<string | null>(null);
	const [supportHistory, setSupportHistory] = useState<SupportHistory[]>([]);
	const [loadingSupport, setLoadingSupport] = useState(true);
	const [supportError, setSupportError] = useState<string | null>(null);
	const [paymentPage, setPaymentPage] = useState(1);
	const [paymentTotalPages, setPaymentTotalPages] = useState(1);
	const [supportPage, setSupportPage] = useState(1);
	const [supportTotalPages, setSupportTotalPages] = useState(1);
	const paymentLimit = 25;
	const supportLimit = 25;
	const [paymentStatus, setPaymentStatus] = useState('all');
	const [supportStatus, setSupportStatus] = useState('all');

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'resolved':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	useEffect(() => {
		const fetchPayments = async () => {
			setLoadingPayment(true);
			setPaymentError(null);
			try {
				const statusParam = paymentStatus !== 'all' ? `&status=${paymentStatus}` : '';
				const res = await apiRequest(
					`/payments?page=${paymentPage}&limit=${paymentLimit}${statusParam}`,
					{},
					true
				);
				if (!res.success) throw new Error(res.message || 'Gagal mengambil data pembayaran');
				setPaymentTotalPages(res.totalPages || 1);
				setPaymentHistory(
					((res.data as PaymentApi[]) || []).map((p) => {
						let formattedDate = '-';
						if (p.paymentDate) {
							try {
								formattedDate = format(new Date(p.paymentDate), 'd MMM yyyy', { locale: localeId });
							} catch {
								formattedDate = '-';
							}
						}
						return {
							id: p._id || p.id || '',
							date: formattedDate,
							amount: p.amount ? `Rp ${Number(p.amount).toLocaleString('id-ID')}` : '-',
							plan: 'Pro Plan',
							status: p.status,
							proofImage: p.proofImageUrl || p.proofUrl || '',
						};
					})
				);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setPaymentError(err.message || 'Gagal mengambil data pembayaran');
				} else {
					setPaymentError('Gagal mengambil data pembayaran');
				}
			} finally {
				setLoadingPayment(false);
			}
		};
		fetchPayments();

		const fetchSupport = async () => {
			setLoadingSupport(true);
			setSupportError(null);
			try {
				const statusParam = supportStatus !== 'all' ? `&status=${supportStatus}` : '';
				const res = await apiRequest(
					`/support/mine?page=${supportPage}&limit=${supportLimit}${statusParam}`,
					{},
					true
				);
				if (!res.success) throw new Error(res.message || 'Gagal mengambil data support');
				setSupportTotalPages(res.totalPages || 1);
				setSupportHistory(
					((res.data as Record<string, unknown>[]) || []).map((s): SupportHistory => {
						let formattedDate = '-';
						if (s.createdAt && typeof s.createdAt === 'string') {
							try {
								formattedDate = format(new Date(s.createdAt), 'd MMM yyyy', { locale: localeId });
							} catch {
								formattedDate = '-';
							}
						}
						return {
							id: (s._id as string) || (s.id as string) || '',
							date: formattedDate,
							message: (s.message as string) || '-',
							status: (s.status as string) || 'pending',
						};
					})
				);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setSupportError(err.message || 'Gagal mengambil data support');
				} else {
					setSupportError('Gagal mengambil data support');
				}
			} finally {
				setLoadingSupport(false);
			}
		};
		fetchSupport();
	}, [paymentPage, paymentStatus, supportPage, supportStatus]);

	useEffect(() => {
		setPaymentPage(1);
	}, [paymentStatus]);
	useEffect(() => {
		setSupportPage(1);
	}, [supportStatus]);

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">History</h1>
					<p className="text-gray-600">View your payment and support history</p>
				</div>

				<Tabs defaultValue="payment" className="w-full">
					<TabsList>
						<TabsTrigger value="payment">Payment</TabsTrigger>
						<TabsTrigger value="support">Support</TabsTrigger>
					</TabsList>

					<TabsContent value="payment">
						<Card>
							<CardHeader>
								<div className="mb-4">
									<div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-2">
										<svg
											className="w-5 h-5 text-blue-500"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
											/>
										</svg>
										<span className="text-sm font-medium">
											Silakan refresh halaman ini secara berkala untuk melihat status pembayaran
											terbaru Anda.
										</span>
									</div>
								</div>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div>
										<CardTitle>Payment History</CardTitle>
										<CardDescription>Your subscription and payment records</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<Filter className="h-4 w-4 text-gray-500" />
										<Select value={paymentStatus} onValueChange={setPaymentStatus}>
											<SelectTrigger className="w-32">
												<SelectValue placeholder="Filter status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All</SelectItem>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="approved">Approved</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{loadingPayment ? (
									<div>Loading...</div>
								) : paymentError ? (
									<div className="text-red-600">{paymentError}</div>
								) : (
									<div className="space-y-4">
										{paymentHistory.length === 0 ? (
											<div>Tidak ada riwayat pembayaran.</div>
										) : (
											paymentHistory.map((payment: PaymentHistory) => (
												<div
													key={payment.id}
													className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
												>
													<div className="space-y-1">
														<p className="font-medium">{payment.plan}</p>
														<p className="text-sm text-gray-500">{payment.date}</p>
														<p className="text-sm font-medium">{payment.amount}</p>
													</div>
													<div className="flex items-center gap-4">
														<span
															className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
																payment.status
															)}`}
														>
															{payment.status}
														</span>
														{payment.proofImage && (
															<Dialog>
																<DialogTrigger asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		onClick={() => setSelectedImage(payment.proofImage)}
																	>
																		<Eye className="h-4 w-4" />
																	</Button>
																</DialogTrigger>
																<DialogContent>
																	<DialogHeader>
																		<DialogTitle>Payment Proof</DialogTitle>
																		<DialogDescription>
																			Transaction made on {payment.date}
																		</DialogDescription>
																	</DialogHeader>
																	<div className="mt-4">
																		<img
																			src={payment.proofImage}
																			alt="Payment proof"
																			className="w-full rounded-lg"
																		/>
																	</div>
																</DialogContent>
															</Dialog>
														)}
													</div>
												</div>
											))
										)}
										{paymentTotalPages > 1 && (
											<div className="flex justify-center items-center gap-4 mt-4">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
													disabled={paymentPage === 1}
												>
													Previous
												</Button>
												<span>
													Page {paymentPage} of {paymentTotalPages}
												</span>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setPaymentPage((p) => Math.min(paymentTotalPages, p + 1))}
													disabled={paymentPage === paymentTotalPages}
												>
													Next
												</Button>
											</div>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="support">
						<Card>
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div>
										<CardTitle>Support History</CardTitle>
										<CardDescription>Your help and support requests</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<Filter className="h-4 w-4 text-gray-500" />
										<Select value={supportStatus} onValueChange={setSupportStatus}>
											<SelectTrigger className="w-32">
												<SelectValue placeholder="Filter status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All</SelectItem>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="resolved">Resolved</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{loadingSupport ? (
									<div>Loading...</div>
								) : supportError ? (
									<div className="text-red-600">{supportError}</div>
								) : (
									<div className="space-y-4">
										{supportHistory.length === 0 ? (
											<div>Tidak ada riwayat bantuan.</div>
										) : (
											supportHistory.map((support) => (
												<div key={support.id} className="p-4 border rounded-lg hover:bg-gray-50">
													<div className="flex justify-between items-start mb-2">
														<div>
															<p className="text-sm text-gray-500">{support.date}</p>
														</div>
														<span
															className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
																support.status
															)}`}
														>
															{support.status}
														</span>
													</div>
													<p className="text-sm text-black">{support.message}</p>
												</div>
											))
										)}
										{supportTotalPages > 1 && (
											<div className="flex justify-center items-center gap-4 mt-4">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSupportPage((p) => Math.max(1, p - 1))}
													disabled={supportPage === 1}
												>
													Previous
												</Button>
												<span>
													Page {supportPage} of {supportTotalPages}
												</span>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSupportPage((p) => Math.min(supportTotalPages, p + 1))}
													disabled={supportPage === supportTotalPages}
												>
													Next
												</Button>
											</div>
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

export default History;
