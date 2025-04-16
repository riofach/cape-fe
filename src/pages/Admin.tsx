
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import UserManagementTab from "@/components/admin/UserManagementTab";
import PaymentProofTab from "@/components/admin/PaymentProofTab";

// Define types to match component expectations
type UserRole = "free" | "pro" | "admin";
type PaymentStatus = "pending" | "approved" | "rejected";

// Mock data for users with proper typing
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "free" as UserRole },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "pro" as UserRole },
  { id: 3, name: "Admin User", email: "admin@example.com", role: "admin" as UserRole },
];

// Mock data for payment proofs with proper typing
const mockPaymentProofs = [
  {
    id: 1,
    userName: "John Doe",
    email: "john@example.com",
    date: "2025-04-16",
    amount: 99000,
    status: "pending" as PaymentStatus,
    proofUrl: "https://example.com/proof1.jpg",
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane@example.com",
    date: "2025-04-15",
    amount: 99000,
    status: "approved" as PaymentStatus,
    proofUrl: "https://example.com/proof2.jpg",
  },
];

const Admin = () => {
  const [users, setUsers] = useState(mockUsers);
  const [payments, setPayments] = useState(mockPaymentProofs);

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
            <UserManagementTab users={users} onRoleChange={handleRoleChange} />
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <PaymentProofTab payments={payments} onStatusChange={handlePaymentStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
