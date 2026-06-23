import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import DesignListClient from './DesignListClient';

async function getInitialDesigns(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/designs`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        const designsData = data.designs || data || [];
        return Array.isArray(designsData) ? designsData : [];
    } catch (err) {
        console.error("Fetch designs error (server):", err);
        return [];
    }
}

export default async function DesignDashboardPage() {
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
            console.error("JWT decode error (server design):", e);
        }
    }

    const designs = isAdmin ? await getInitialDesigns(token) : [];

    return (
        <DesignListClient 
            initialDesigns={designs} 
            isAdmin={isAdmin} 
        />
    );
}
