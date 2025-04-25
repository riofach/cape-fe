import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { apiRequest } from '@/utils/api';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
	_id: string;
	username?: string;
	name?: string;
	email: string;
	phoneNumber: string;
	avatarUrl?: string;
	role?: string;
}

const Profile = () => {
	const [userData, setUserData] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [changeLoading, setChangeLoading] = useState(false);
	const [changeError, setChangeError] = useState<string | null>(null);
	const [changeSuccess, setChangeSuccess] = useState<string | null>(null);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [subscription, setSubscription] = useState<{ status: string; endDate?: string } | null>(
		null
	);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await apiRequest('/auth/profile', {}, true);
				setUserData(res.data as UserProfile);
			} catch (err) {
				setError('Gagal memuat data profil. Silakan login ulang.');
				setUserData(null);
			} finally {
				setLoading(false);
			}
		};
		const fetchSubscription = async () => {
			try {
				const res = await apiRequest('/auth/subscription/status', {}, true);
				setSubscription(res);
			} catch {
				setSubscription(null);
			}
		};
		fetchProfile();
		fetchSubscription();
	}, []);

	const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setChangeError(null);
		setChangeSuccess(null);
		if (!currentPassword || !newPassword) {
			setChangeError('Semua field wajib diisi.');
			return;
		}
		if (newPassword.length < 8) {
			setChangeError('Password baru minimal 8 karakter.');
			return;
		}
		setChangeLoading(true);
		try {
			await apiRequest(
				'/auth/change-password',
				{
					method: 'POST',
					body: JSON.stringify({
						currentPassword,
						newPassword,
					}),
				},
				true
			);
			setChangeSuccess('Password berhasil diubah.');
			setCurrentPassword('');
			setNewPassword('');
		} catch (err) {
			setChangeError('Gagal mengganti password.');
		} finally {
			setChangeLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<h1 className="text-2xl font-bold">User Profile</h1>

				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div className="text-red-600">{error}</div>
				) : userData ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Profile Card */}
						<Card className="md:col-span-1">
							<CardHeader>
								<CardTitle>Profile Photo</CardTitle>
								<CardDescription>Your profile photo is visible to other users.</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col items-center space-y-4">
								<Avatar className="w-32 h-32">
									<AvatarImage
										src={userData.avatarUrl || 'https://github.com/shadcn.png'}
										alt={userData.username || userData.name}
									/>
									<AvatarFallback>
										{(userData.username || userData.name || 'U')
											.split(' ')
											.map((n: string) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<p className="text-xs text-muted-foreground">
									Default profile photo cannot be changed
								</p>
							</CardContent>
						</Card>

						{/* Account Information */}
						<Card className="md:col-span-2">
							<CardHeader>
								<CardTitle>Account Information</CardTitle>
								<CardDescription>View and update your account details.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input id="name" value={userData.username || userData.name || ''} readOnly />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input id="email" type="email" value={userData.email || ''} readOnly />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phoneNumber">Phone Number</Label>
									<Input id="phoneNumber" value={userData.phoneNumber || ''} readOnly />
								</div>
							</CardContent>
							<CardFooter>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => setShowChangePassword(true)}
								>
									Change Password
								</Button>
							</CardFooter>
						</Card>
					</div>
				) : null}

				{/* Subscription Information */}
				<Card>
					<CardHeader>
						<CardTitle>Subscription Details</CardTitle>
						<CardDescription>Your current plan and billing information.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between items-center pb-4 border-b">
							<div>
								<h3 className="font-medium">Current Plan</h3>
								<p className="text-sm text-muted-foreground">
									{subscription?.status === 'pro'
										? 'Pro Plan'
										: userData?.role === 'admin'
										? 'Admin'
										: 'Free Plan'}
								</p>
							</div>
							<div
								className={`px-3 py-1 rounded-full text-xs ${
									subscription?.status === 'pro'
										? 'bg-[#8B5CF6] text-white'
										: 'bg-gray-300 text-gray-700'
								}`}
							>
								{subscription?.status === 'pro' ? 'Active' : 'Free'}
							</div>
						</div>
						<div className="flex justify-between items-center">
							<div>
								<h3 className="font-medium">Next Billing Date</h3>
								<p className="text-sm text-muted-foreground">
									{subscription?.status === 'pro' &&
									subscription.endDate &&
									!isNaN(Date.parse(subscription.endDate))
										? new Date(subscription.endDate).toLocaleDateString('id-ID', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
										  })
										: '-'}
								</p>
							</div>
							<Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
								Manage Subscription
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Modal Change Password */}
				<Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Change Password</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleChangePassword} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="currentPassword">Current Password</Label>
								<div className="relative">
									<Input
										id="currentPassword"
										type={showCurrentPassword ? 'text' : 'password'}
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										required
									/>
									<button
										type="button"
										className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
										onClick={() => setShowCurrentPassword((v) => !v)}
										tabIndex={-1}
									>
										{showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="newPassword">New Password</Label>
								<div className="relative">
									<Input
										id="newPassword"
										type={showNewPassword ? 'text' : 'password'}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
									<button
										type="button"
										className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
										onClick={() => setShowNewPassword((v) => !v)}
										tabIndex={-1}
									>
										{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>
							{changeError && <div className="text-red-600 text-sm">{changeError}</div>}
							{changeSuccess && <div className="text-green-600 text-sm">{changeSuccess}</div>}
							<DialogFooter>
								<Button type="submit" disabled={changeLoading}>
									{changeLoading ? 'Saving...' : 'Change Password'}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</DashboardLayout>
	);
};

export default Profile;
