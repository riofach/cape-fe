
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Payment = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the file upload to your backend
    toast({
      title: "Payment proof submitted",
      description: "We will review your payment and upgrade your account soon.",
    });
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
                      <p className="text-sm">Bank: Bank Central Asia (BCA)</p>
                      <p className="text-sm">Account Number: 1234567890</p>
                      <p className="text-sm">Account Name: CAPE Admin</p>
                      <p className="text-sm font-semibold">Amount: Rp99.000</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about your payment..."
                      className="mt-1"
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
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Please upload a screenshot or photo of your payment receipt
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Payment Proof
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
