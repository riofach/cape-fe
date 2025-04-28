import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			const token = sessionStorage.getItem('token');
			if (!token) {
				setIsAuthenticated(false);
				setIsLoading(false);
				return;
			}

			try {
				const res = await apiFetch('/api/auth/profile', {
					headers: { Authorization: `Bearer ${token}` },
				});

				const user = res.data;

				if (user && user.force_logout === true) {
					console.log('Force logout detected, logging out...');
					sessionStorage.removeItem('token');
					sessionStorage.removeItem('user');
					setIsAuthenticated(false);
				} else if (user) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
					sessionStorage.removeItem('token');
					sessionStorage.removeItem('user');
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				sessionStorage.removeItem('token');
				sessionStorage.removeItem('user');
				setIsAuthenticated(false);
			}
			setIsLoading(false);
		};

		checkAuth();
	}, [navigate]);

	if (isLoading) {
		return <div>Loading authentication...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
