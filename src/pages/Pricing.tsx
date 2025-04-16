
import { CheckCircle2, X } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs and start tracking your expenses efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Rp0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-2" />
                  <span>WhatsApp Integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Web Input Only</span>
                </div>
                <div className="flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-2" />
                  <span>Reports Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic Expense Tracking</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary">
            <Badge className="absolute -top-2 right-4 bg-primary">Recommended</Badge>
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>For advanced expense tracking</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Rp99.000</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>WhatsApp Integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Web & WhatsApp Input</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Full Reports Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Detailed Analytics</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/payment" className="w-full">
                <Button className="w-full bg-primary">
                  Upgrade to Pro
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
