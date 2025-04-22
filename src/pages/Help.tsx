import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

const Help = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Cek login dan fetch profile jika login
		const fetchProfile = async () => {
			try {
				const res = await apiRequest('/auth/profile', {}, true);
				setFormData((prev) => ({
					...prev,
					name: res.data.username || res.data.name || '',
					email: res.data.email || '',
				}));
				setIsLoggedIn(true);
			} catch {
				setIsLoggedIn(false);
			}
		};
		fetchProfile();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await apiRequest(
				'/support',
				{
					method: 'POST',
					body: JSON.stringify({ message: formData.message }),
				},
				true // kirim token jika ada
			);
			toast({
				title: 'Pesan terkirim',
				description: 'Kami akan membalas secepatnya melalui email.',
			});
			if (isLoggedIn) {
				setFormData((prev) => ({ ...prev, message: '' }));
			} else {
				setFormData({ name: '', email: '', message: '' });
			}
		} catch (err: unknown) {
			let errorMsg = 'Terjadi kesalahan';
			if (err && typeof err === 'object' && 'message' in err) {
				errorMsg = (err as { message?: string }).message || errorMsg;
			}
			toast({
				title: 'Gagal mengirim pesan',
				description: errorMsg,
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLoginRedirect = (e: React.MouseEvent) => {
		e.preventDefault();
		navigate('/login');
	};

	return (
		<MainLayout>
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto space-y-12">
					<section className="text-center space-y-4">
						<h1 className="text-4xl font-bold tracking-tight">Need Help?</h1>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Our team of professionals is here to help you with any questions or concerns you may
							have about our expense tracking service.
						</p>
					</section>

					<section className="grid md:grid-cols-2 gap-8">
						<Card>
							<CardHeader>
								<CardTitle>Professional Support</CardTitle>
								<CardDescription>
									Get in touch with our expert team for personalized assistance
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<h3 className="font-semibold">Expert Team</h3>
									<p className="text-sm text-gray-600">
										Our support team consists of certified financial professionals and technical
										experts ready to assist you.
									</p>
								</div>
								<div className="space-y-2">
									<h3 className="font-semibold">Quick Response</h3>
									<p className="text-sm text-gray-600">
										We aim to respond to all inquiries within 24 hours during business days.
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Contact Us</CardTitle>
								<CardDescription>
									Fill out the form below and we'll get back to you shortly
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={isLoggedIn ? handleSubmit : undefined} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											required
											readOnly={isLoggedIn}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											required
											readOnly={isLoggedIn}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											value={formData.message}
											onChange={(e) => setFormData({ ...formData, message: e.target.value })}
											required
											className="min-h-[120px]"
										/>
									</div>
									{isLoggedIn ? (
										<Button type="submit" className="w-full" disabled={loading}>
											{loading ? 'Sending...' : 'Send Message'}
										</Button>
									) : (
										<Button
											type="button"
											className="w-full"
											variant="secondary"
											onClick={handleLoginRedirect}
										>
											Login untuk mengirim pesan
										</Button>
									)}
								</form>
							</CardContent>
						</Card>
					</section>
				</div>
			</div>
		</MainLayout>
	);
};

export default Help;
