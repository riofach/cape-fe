
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Eye, Search, Filter } from "lucide-react";

type PaymentProof = {
  id: number;
  userName: string;
  email: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  proofUrl: string;
};

type PaymentStatus = "pending" | "approved" | "rejected";

interface PaymentProofTabProps {
  payments: PaymentProof[];
  onStatusChange: (paymentId: number, newStatus: PaymentStatus) => void;
}

const PaymentProofTab = ({ payments, onStatusChange }: PaymentProofTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

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

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={statusFilter}
            onValueChange={(value: PaymentStatus | "all") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
            {filteredPayments.map((payment) => (
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
                  <Badge className={getPaymentStatusColor(payment.status)}>
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
                      onClick={() => onStatusChange(payment.id, "approved")}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onStatusChange(payment.id, "rejected")}
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
  );
};

export default PaymentProofTab;
