import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import RolesListClient from './RolesListClient';

async function getInitialRoles(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/roles`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.roles || [];
    } catch (err) {
        console.error("Fetch roles error (server):", err);
        return [];
    }
}

export default async function RolesDashboardPage() {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    const token = cookieHeader.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    let user = null;
    let isSuperAdmin = false;

    if (token) {
        try {
            user = jwtDecode(token);
            isSuperAdmin = user.role === 'superadmin';
        } catch (e) {
            console.error("JWT decode error (server):", e);
        }
    }

    if (!isSuperAdmin) {
        redirect('/admin');
    }

    const roles = await getInitialRoles(token);

    return (
        <RolesListClient 
            initialRoles={roles} 
            isSuperAdmin={isSuperAdmin}
        />
    );
}
