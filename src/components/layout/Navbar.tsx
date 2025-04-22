import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		setIsLoggedIn(!!localStorage.getItem('token'));
	}, []);

	return (
		<header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						<div className="w-8 h-8 rounded flex items-center justify-center">
							<img src="/cape2.png" alt="CAPE Logo" className="w-8" />
						</div>
						<span className="font-bold text-xl text-gray-900">CAPE</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link to="/" className="text-gray-700 hover:text-primary font-medium">
							Home
						</Link>
						<Link to="/pricing" className="text-gray-700 hover:text-primary font-medium">
							Pricing
						</Link>
						<Link to="/help" className="text-gray-700 hover:text-primary font-medium">
							Help
						</Link>
					</nav>

					{/* Auth Buttons - Desktop */}
					<div className="hidden md:flex items-center space-x-4">
						{isLoggedIn ? (
							<Link to="/dashboard">
								<Button className="bg-primary-gradient hover:opacity-90 font-medium">
									Dashboard
								</Button>
							</Link>
						) : (
							<>
								<Link to="/login">
									<Button variant="outline" className="font-medium">
										Login
									</Button>
								</Link>
								<Link to="/register">
									<Button className="bg-primary-gradient hover:opacity-90 font-medium">
										Sign Up
									</Button>
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle menu"
						>
							{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden border-t border-gray-100">
					<div className="container mx-auto px-4 py-4 space-y-4">
						<Link
							to="/"
							className="block py-2 text-gray-700 hover:text-primary font-medium"
							onClick={() => setIsMenuOpen(false)}
						>
							Home
						</Link>
						<Link
							to="/pricing"
							className="block py-2 text-gray-700 hover:text-primary font-medium"
							onClick={() => setIsMenuOpen(false)}
						>
							Pricing
						</Link>
						<Link
							to="/help"
							className="block py-2 text-gray-700 hover:text-primary font-medium"
							onClick={() => setIsMenuOpen(false)}
						>
							Help
						</Link>
						<div className="pt-2 flex flex-col space-y-3">
							{isLoggedIn ? (
								<Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
									<Button className="w-full bg-primary-gradient hover:opacity-90">Dashboard</Button>
								</Link>
							) : (
								<>
									<Link to="/login" onClick={() => setIsMenuOpen(false)}>
										<Button variant="outline" className="w-full">
											Login
										</Button>
									</Link>
									<Link to="/register" onClick={() => setIsMenuOpen(false)}>
										<Button className="w-full bg-primary-gradient hover:opacity-90">Sign Up</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Navbar;
