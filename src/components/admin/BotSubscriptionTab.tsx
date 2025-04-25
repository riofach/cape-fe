import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/utils/api';

/**
 * Komponen Tab Bot untuk mengatur durasi subscription (dalam hari)
 * Hanya bisa diakses admin
 */
const BotSubscriptionTab = () => {
	const [duration, setDuration] = useState<number>(30); // Default 30 hari
	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	// Ambil durasi subscription saat ini dari backend
	useEffect(() => {
		const fetchDuration = async () => {
			setLoading(true);
			try {
				const res = await apiRequest('/settings/subscription-duration', {}, true);
				setDuration(res.value);
			} catch (err: unknown) {
				let msg = 'Terjadi kesalahan';
				if (err && typeof err === 'object' && 'message' in err) {
					msg = (err as { message?: string }).message || msg;
				}
				toast({
					title: 'Gagal mengambil durasi',
					description: msg,
					variant: 'destructive',
				});
			} finally {
				setLoading(false);
			}
		};
		fetchDuration();
	}, []);

	// Handler untuk submit perubahan durasi
	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (duration < 1) {
			toast({ title: 'Durasi minimal 1 hari', variant: 'destructive' });
			return;
		}
		setSaving(true);
		try {
			await apiRequest(
				'/settings/subscription-duration',
				{
					method: 'PATCH',
					body: JSON.stringify({ value: duration }),
				},
				true
			);
			toast({
				title: 'Durasi subscription berhasil diupdate',
				description: `Durasi sekarang: ${duration} hari`,
			});
		} catch (err: unknown) {
			let msg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				msg = (err as { message?: string }).message || msg;
			}
			toast({
				title: 'Gagal update durasi',
				description: msg,
				variant: 'destructive',
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pengaturan Durasi Subscription Bot</CardTitle>
				<CardDescription>
					Atur berapa hari durasi subscription <b>Pro</b> yang akan diberikan ke user setiap
					transaksi payment baru. Perubahan hanya berlaku untuk transaksi berikutnya.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSave} className="flex flex-col gap-4 max-w-xs">
					<label className="font-medium">Durasi Subscription (hari)</label>
					<Input
						type="number"
						min={1}
						value={loading ? '' : duration}
						onChange={(e) => setDuration(Number(e.target.value))}
						disabled={loading || saving}
						required
					/>
					<Button type="submit" disabled={loading || saving}>
						{saving ? 'Menyimpan...' : 'Simpan'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default BotSubscriptionTab;
