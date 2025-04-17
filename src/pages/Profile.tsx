import { useState } from 'react';
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
import { Eye, EyeOff } from 'lucide-react';

const Profile = () => {
	const [showPassword, setShowPassword] = useState(false);

	// Mock user data
	const userData = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		password: 'securepassword123',
		avatarUrl: 'https://github.com/shadcn.png',
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<h1 className="text-2xl font-bold">User Profile</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Profile Card */}
					<Card className="md:col-span-1">
						<CardHeader>
							<CardTitle>Profile Photo</CardTitle>
							<CardDescription>Your profile photo is visible to other users.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center space-y-4">
							<Avatar className="w-32 h-32">
								<AvatarImage src={userData.avatarUrl} alt={userData.name} />
								<AvatarFallback>
									{userData.name
										.split(' ')
										.map((n) => n[0])
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
								<Input id="name" defaultValue={userData.name} readOnly />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input id="email" type="email" defaultValue={userData.email} readOnly />
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										defaultValue={userData.password}
										readOnly
									/>
									<Button
										variant="ghost"
										size="icon"
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute right-0 top-0 h-full px-3"
									>
										{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										<span className="sr-only">
											{showPassword ? 'Hide password' : 'Show password'}
										</span>
									</Button>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="outline" className="w-full">
								Update Password
							</Button>
						</CardFooter>
					</Card>
				</div>

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
								<p className="text-sm text-muted-foreground">Pro Plan</p>
							</div>
							<div className="bg-primary px-3 py-1 rounded-full text-white text-xs">Active</div>
						</div>

						<div className="flex justify-between items-center">
							<div>
								<h3 className="font-medium">Next Billing Date</h3>
								<p className="text-sm text-muted-foreground">May 15, 2025</p>
							</div>
							<Button variant="outline" size="sm">
								Manage Subscription
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
};

export default Profile;
