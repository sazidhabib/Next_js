'use client';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                if (allowedRoles && allowedRoles.includes('admin')) {
                    router.push('/admin/login');
                } else {
                    router.push('/login');
                }
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                if (allowedRoles.includes('admin')) {
                    router.push('/admin/login');
                } else {
                    router.push('/login');
                }
            }
        }
    }, [user, loading, allowedRoles, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null; // or a loading spinner while redirecting
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
