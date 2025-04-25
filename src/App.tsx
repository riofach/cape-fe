import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import History from './pages/History';
import Admin from './pages/Admin';
import Pricing from './pages/Pricing';
import Payment from './pages/Payment';
import Help from './pages/Help';
import ProtectedRoute from '@/components/ProtectedRoute';
import Income from './pages/Income';
import Profile from './pages/Profile';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/expenses"
						element={
							<ProtectedRoute>
								<Expenses />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/reports"
						element={
							<ProtectedRoute>
								<Reports />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/history"
						element={
							<ProtectedRoute>
								<History />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin"
						element={
							<ProtectedRoute>
								<Admin />
							</ProtectedRoute>
						}
					/>
					<Route path="/pricing" element={<Pricing />} />
					<Route
						path="/payment"
						element={
							<ProtectedRoute>
								<Payment />
							</ProtectedRoute>
						}
					/>
					<Route path="/help" element={<Help />} />
					<Route
						path="/income"
						element={
							<ProtectedRoute>
								<Income />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
