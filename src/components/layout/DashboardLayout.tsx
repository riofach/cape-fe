
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  CreditCard, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  UserCircle, 
  X,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", icon: Home, href: "/dashboard", current: location.pathname === "/dashboard" },
    { name: "Expenses", icon: CreditCard, href: "/expenses", current: location.pathname === "/expenses" },
    { name: "Reports", icon: BarChart3, href: "/reports", current: location.pathname === "/reports" },
    { name: "Settings", icon: Settings, href: "/settings", current: location.pathname === "/settings" },
    { name: "Help", icon: FileText, href: "/help", current: location.pathname === "/help" },
    { name: "Admin", icon: UserCog, href: "/admin", current: location.pathname === "/admin" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation - Mobile & Desktop */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="h-full flex flex-col">
                  {/* Mobile Sidebar Header */}
                  <div className="px-4 py-6 border-b border-gray-200 flex items-center">
                    <div className="w-8 h-8 rounded bg-primary-gradient flex items-center justify-center">
                      <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900 ml-2">CAPE</span>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 px-4 py-4 space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          item.current
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className={`mr-3 h-5 w-5 ${item.current ? "text-white" : "text-gray-500"}`} />
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Sidebar Footer */}
                  <div className="px-4 py-4 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo - Visible on All Screens */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-primary-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">CAPE</span>
            </Link>
          </div>

          {/* User Profile Menu */}
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
              <div className="relative">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Badge 
                  className="absolute -top-2 -right-2 bg-[#8B5CF6] hover:bg-[#7C3AED] px-2 py-0.5 text-[10px]"
                >
                  PRO
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
            {/* Sidebar Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${item.current ? "text-white" : "text-gray-500"}`} />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="px-4 py-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
