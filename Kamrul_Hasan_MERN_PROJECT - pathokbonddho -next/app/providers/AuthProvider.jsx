'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Remove cookie
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }, []);

    const login = useCallback((token) => {
        try {
            const decoded = jwtDecode(token);
            const userData = {
                userId: decoded.userId,
                email: decoded.email,
                isAdmin: decoded.isAdmin,
                role: decoded.role,
                token
            };
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            // Set cookie for SSR
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        } catch (error) {
            console.error('Login error:', error);
        }
    }, []);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    
                    // Proactive check: if token is expired, log out immediately
                    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                        console.warn('Session expired. Logging out.');
                        logout();
                        
                        // If we're on an admin page, redirect to login
                        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                            const currentPath = window.location.pathname + window.location.search;
                            window.location.replace(`/login?expired=true&redirectTo=${encodeURIComponent(currentPath)}`);
                        } else if (typeof window !== 'undefined') {
                            // Silent logout for frontend: reload to update header/UI state
                            window.location.reload();
                        }
                    } else if (!user) {
                        // Restore user if not set but token is valid
                        const userData = {
                            userId: decoded.userId,
                            email: decoded.email,
                            isAdmin: decoded.isAdmin,
                            role: decoded.role,
                            token
                        };
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                    }
                } catch (error) {
                    console.error('Token decode error:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkToken();
        const interval = setInterval(checkToken, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [logout, user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
