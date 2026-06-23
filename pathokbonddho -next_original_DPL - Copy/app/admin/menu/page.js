import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import MenuListClient from './MenuListClient';

async function getInitialMenus(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/menus?format=flat`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || data || [];
    } catch (err) {
        console.error("Fetch menus error (server):", err);
        return [];
    }
}

async function getParentMenus(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/menus/parents`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (err) {
        console.error("Fetch parents error (server):", err);
        return [];
    }
}

export default async function MenuDashboardPage() {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    const token = cookieHeader.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    let user = null;
    let isAdmin = false;

    if (token) {
        try {
            user = jwtDecode(token);
            isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.isAdmin;
        } catch (e) {
            console.error("JWT decode error (server menu):", e);
        }
    }

    const [menus, parents] = isAdmin 
        ? await Promise.all([getInitialMenus(token), getParentMenus(token)])
        : [[], []];

    return (
        <MenuListClient 
            initialMenus={menus} 
            initialParents={parents}
            isAdmin={isAdmin} 
        />
    );
}
