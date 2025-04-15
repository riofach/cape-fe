
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowRight } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      // Show error about needing to agree to terms
      return;
    }
    
    setLoading(true);
    
    // TODO: Implement actual API call to /api/auth/register
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful registration, redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded bg-primary-gradient flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to start tracking your expenses
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="full-name">Full name</Label>
                <div className="mt-1">
                  <Input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full"
                    placeholder="Create a password"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="agree-terms"
                  required
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <Label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-primary-gradient hover:opacity-90 py-6"
                  disabled={loading || !agreeTerms}
                >
                  {loading ? "Creating account..." : "Create account"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.0003 2.00001C6.47981 2.00001 2.00031 6.47951 2.00031 12C2.00031 16.6 5.13831 20.4 9.37931 21.6C9.87931 21.7 10.0003 21.4 10.0003 21.1V19.4C7.00031 20 6.60031 18.3 6.40031 17.8C6.30031 17.6 5.70031 16.8 5.30031 16.6C5.00031 16.4 4.60031 16 5.30031 16C6.00031 16 6.50031 16.7 6.70031 17C7.40031 18.2 8.60031 17.9 10.0003 17.6C10.1003 17 10.4003 16.6 10.7003 16.4C8.50031 16.2 6.20031 15.5 6.20031 12C6.20031 11 6.50031 10.1 7.00031 9.5C6.90031 9.3 6.60031 8.5 7.10031 7.1C7.10031 7.1 7.80031 6.9 10.1003 8.3C10.9003 8.1 11.7003 8 12.5003 8C13.3003 8 14.1003 8.1 14.9003 8.3C17.1003 6.8 17.9003 7.1 17.9003 7.1C18.4003 8.5 18.1003 9.3 18.0003 9.5C18.5003 10.1 18.8003 10.9 18.8003 12C18.8003 15.5 16.5003 16.2 14.3003 16.4C14.7003 16.7 15.0003 17.3 15.0003 18.2V21.1C15.0003 21.4 15.1003 21.7 15.6003 21.6C19.9003 20.4 22.9993 16.6 22.9993 12C23.0003 6.47951 18.5208 2.00001 12.0003 2.00001Z" />
                  </svg>
                  GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                    />
                  </svg>
                  Google
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
