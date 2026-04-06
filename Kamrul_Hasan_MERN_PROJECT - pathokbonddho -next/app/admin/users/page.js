import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import UsersListClient from './UsersListClient';

async function getInitialUsers(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.users || [];
    } catch (err) {
        console.error("Fetch users error (server):", err);
        return [];
    }
}

export default async function UsersDashboardPage() {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    const token = cookieHeader.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    let user = null;
    let isAdmin = false;
    let isSuperAdmin = false;

    if (token) {
        try {
            user = jwtDecode(token);
            isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.isAdmin;
            isSuperAdmin = user.role === 'superadmin';
        } catch (e) {
            console.error("JWT decode error (server):", e);
        }
    }

    const users = isAdmin ? await getInitialUsers(token) : [];

    return (
        <UsersListClient 
            initialUsers={users} 
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
        />
    );
}
