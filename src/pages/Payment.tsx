import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

const Payment = () => {
	const [file, setFile] = useState<File | null>(null);
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [hasPendingPayment, setHasPendingPayment] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	const fetchPendingPayment = async () => {
		try {
			const token = sessionStorage.getItem('token');
			const res = await apiFetch('/api/payments?status=pending', {
				headers: { Authorization: `Bearer ${token}` },
			});
			// console.log('Pending payment response:', res);
			setHasPendingPayment(res.data && res.data.length > 0);
		} catch {
			setHasPendingPayment(false);
		}
	};

	useEffect(() => {
		fetchPendingPayment();
		// Polling setiap 10 detik
		pollingRef.current = setInterval(fetchPendingPayment, 10000);
		// Event listener saat user kembali ke halaman/tab
		const handleVisibility = () => {
			if (document.visibilityState === 'visible') {
				fetchPendingPayment();
			}
		};
		document.addEventListener('visibilitychange', handleVisibility);
		return () => {
			if (pollingRef.current) clearInterval(pollingRef.current);
			document.removeEventListener('visibilitychange', handleVisibility);
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			toast({
				title: 'File bukti pembayaran wajib diupload',
				description: 'Silakan upload gambar bukti transfer.',
				variant: 'destructive',
			});
			return;
		}
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append('proof', file);
			formData.append('notes', notes);
			// Jika ingin custom amount, tambahkan: formData.append('amount', '10000');

			const token = sessionStorage.getItem('token');
			await apiFetch('/api/payments/upload', {
				method: 'POST',
				headers: {
					Authorization: token ? `Bearer ${token}` : '',
				},
				body: formData,
			});
			toast({
				title: 'Bukti pembayaran berhasil dikirim',
				description: 'Kami akan review pembayaran Anda dan upgrade akun jika valid.',
			});
			setFile(null);
			setNotes('');
			setHasPendingPayment(true);
			if (fileInputRef.current) fileInputRef.current.value = '';
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			toast({
				title: 'Gagal upload bukti pembayaran',
				description: errorMsg,
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<MainLayout>
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					<Card>
						<CardHeader>
							<CardTitle>Payment Details</CardTitle>
							<CardDescription>Please complete your payment and upload the proof</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-4">
									<div>
										<Label>Bank Transfer Details</Label>
										<div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">
											<p className="text-sm">Bank: Bank Jago</p>
											<p className="text-sm">Account Number: 100843089523</p>
											<p className="text-sm">Account Name: Fachrio Raditya</p>
											<p className="text-sm font-semibold">Amount: Rp10.000</p>
										</div>
									</div>

									<div>
										<Label htmlFor="notes">Additional Notes (Optional)</Label>
										<Textarea
											id="notes"
											placeholder="Add any notes about your payment..."
											className="mt-1"
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
										/>
									</div>

									<div>
										<Label htmlFor="proof">Payment Proof</Label>
										<Input
											id="proof"
											type="file"
											accept="image/*"
											onChange={(e) => setFile(e.target.files?.[0] || null)}
											className="mt-1"
											ref={fileInputRef}
										/>
										<p className="text-sm text-gray-500 mt-1">
											Please upload a screenshot or photo of your payment receipt
										</p>
									</div>
								</div>

								{hasPendingPayment && (
									<div className="text-yellow-600 text-sm mb-2">
										Anda sudah mengirim bukti pembayaran, silakan tunggu verifikasi admin sebelum
										mengirim lagi.
									</div>
								)}

								<Button type="submit" className="w-full" disabled={loading || hasPendingPayment}>
									{loading ? 'Waiting...' : 'Submit Payment Proof'}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</MainLayout>
	);
};

export default Payment;
