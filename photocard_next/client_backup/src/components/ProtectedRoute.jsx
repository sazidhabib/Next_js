import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    // console.log('ProtectedRoute Debug:', { path: window.location.pathname, user, loading, allowedRoles });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // If checking for admin role (even if not logged in), send to admin login
        if (allowedRoles && allowedRoles.includes('admin')) {
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user is logged in but wrong role (e.g. user trying to access admin), 
        // redirect to admin login so they can switch accounts
        if (allowedRoles.includes('admin')) {
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/login" replace />; // Unauthorized for other reasons
    }

    return <Outlet />;
};

export default ProtectedRoute;
