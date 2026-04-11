import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './components/AdminLayoutClient';

export default async function AdminLayout({ children }) {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    const token = cookieHeader.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
        redirect('/login');
    }

    let user = null;

    try {
        if (token) {
            user = jwtDecode(token);
            
            // Check expiry and admin status
            const isExpired = user.exp && user.exp * 1000 < Date.now();
            const isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.isAdmin;
            
            if (isExpired || !isAdmin) {
                // We don't redirect here to prevent ERR_TOO_MANY_REDIRECTS.
                // AdminLayoutClient will handle the redirection.
                user = null; 
            } else {
                user.isAdmin = isAdmin;
            }
        }
    } catch (e) {
        console.error("JWT decode error in AdminLayout:", e);
        user = null;
    }

    return (
        <AdminLayoutClient user={user}>
            {children}
        </AdminLayoutClient>
    );
}
