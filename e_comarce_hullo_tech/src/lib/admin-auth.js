import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AdminAuthWrapper - Protects admin pages by verifying token and user role
 * Redirects to login if not authenticated or not admin
 */
export function useAdminAuth() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Get token from localStorage
                const savedToken = localStorage.getItem('adminToken');
                const savedUser = localStorage.getItem('adminUser');

                if (!savedToken || !savedUser) {
                    router.push('/admin/login');
                    return;
                }

                // Verify token with backend
                const response = await fetch('/api/admin/check-auth', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${savedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    // Token is invalid or expired
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    router.push('/admin/login');
                    return;
                }

                const data = await response.json();

                if (data.success && data.data.role === 'admin') {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    setIsAuthorized(true);
                } else {
                    // Not an admin user
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    return { isAuthorized, user, token, isLoading };
}

/**
 * Logout helper - clears auth data and redirects to login
 */
export function handleAdminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.cookie = 'adminToken=; path=/; max-age=0';
    document.cookie = 'adminUser=; path=/; max-age=0';
    window.location.href = '/admin/login';
}
