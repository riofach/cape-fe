import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Search, Filter } from 'lucide-react';

type User = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
};

type UserRole = 'free' | 'pro' | 'admin';

interface UserManagementTabProps {
	users: User[];
	onRoleChange: (userId: string, newRole: UserRole) => void;
}

const UserManagementTab = ({ users, onRoleChange }: UserManagementTabProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

	const getRoleBadgeColor = (role: UserRole) => {
		switch (role) {
			case 'pro':
				return 'bg-[#8B5CF6] text-white';
			case 'admin':
				return 'bg-red-500 text-white';
			default:
				return 'bg-gray-200 text-gray-700';
		}
	};

	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesRole = roleFilter === 'all' || user.role === roleFilter;

		return matchesSearch && matchesRole;
	});

	return (
		<div className="space-y-4">
			<div className="flex gap-4 items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
					<Input
						placeholder="Search users..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-gray-500" />
					<Select
						value={roleFilter}
						onValueChange={(value: UserRole | 'all') => setRoleFilter(value)}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Filter role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							<SelectItem value="free">Free</SelectItem>
							<SelectItem value="pro">Pro</SelectItem>
							<SelectItem value="admin">Admin</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-lg border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Current Role</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredUsers.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<Badge className={getRoleBadgeColor(user.role)}>{user.role.toUpperCase()}</Badge>
								</TableCell>
								<TableCell>
									<Select
										defaultValue={user.role}
										onValueChange={(value: UserRole) => onRoleChange(user.id, value)}
									>
										<SelectTrigger className="w-32">
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="free">Free</SelectItem>
											<SelectItem value="pro">Pro</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default UserManagementTab;
