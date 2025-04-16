import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Eye } from "lucide-react";

// Mock data for users
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "free" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "pro" },
  { id: 3, name: "Admin User", email: "admin@example.com", role: "admin" },
];

// Mock data for payment proofs
const mockPaymentProofs = [
  {
    id: 1,
    userName: "John Doe",
    email: "john@example.com",
    date: "2025-04-16",
    amount: 99000,
    status: "pending",
    proofUrl: "https://example.com/proof1.jpg",
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane@example.com",
    date: "2025-04-15",
    amount: 99000,
    status: "approved",
    proofUrl: "https://example.com/proof2.jpg",
  },
];

type UserRole = "free" | "pro" | "admin";
type PaymentStatus = "pending" | "approved" | "rejected";

const Admin = () => {
  const [users, setUsers] = useState(mockUsers);
  const [payments, setPayments] = useState(mockPaymentProofs);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast({
      title: "Role Updated",
      description: "User role has been successfully updated.",
    });
  };

  const handlePaymentStatus = (paymentId: number, newStatus: PaymentStatus) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId ? { ...payment, status: newStatus } : payment
    ));
    toast({
      title: "Payment Status Updated",
      description: `Payment has been ${newStatus}.`,
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "pro":
        return "bg-[#8B5CF6] text-white";
      case "admin":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-yellow-500 text-white";
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
          </TabsList>

          <TabsContent value="users" className="mt-4">
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role as UserRole)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
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
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.userName}</p>
                          <p className="text-sm text-gray-500">{payment.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        {payment.amount.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payment.status as PaymentStatus)}>
                          {payment.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProof(payment.proofUrl)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePaymentStatus(payment.id, "approved")}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePaymentStatus(payment.id, "rejected")}
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
          <DialogContent className="max-w-3xl">
            <div className="w-full">
              <img 
                src={selectedProof || ''} 
                alt="Payment Proof" 
                className="w-full object-contain max-h-[70vh]"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
