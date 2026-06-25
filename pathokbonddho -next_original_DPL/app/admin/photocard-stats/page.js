import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import PhotocardStatsClient from './PhotocardStatsClient';

async function getInitialStats(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/photocards/stats`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Fetch photocard stats error (server):", err);
        return [];
    }
}

export default async function PhotocardStatsDashboardPage() {
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
            console.error("JWT decode error (server photocard stats):", e);
        }
    }

    const statsData = isAdmin ? await getInitialStats(token) : [];

    return (
        <PhotocardStatsClient 
            initialStats={statsData} 
            isAdmin={isAdmin} 
        />
    );
}
