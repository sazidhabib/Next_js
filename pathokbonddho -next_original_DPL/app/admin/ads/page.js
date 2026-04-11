import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import AdsListClient from './AdsListClient';

async function getInitialAds(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/ads?page=1&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return { ads: [], totalCount: 0 };
        const data = await res.json();
        return {
            ads: data.ads || [],
            totalCount: data.totalCount || 0
        };
    } catch (err) {
        console.error("Fetch ads error (server):", err);
        return { ads: [], totalCount: 0 };
    }
}

export default async function AdsDashboardPage() {
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
            console.error("JWT decode error (server ads):", e);
        }
    }

    const { ads, totalCount } = isAdmin ? await getInitialAds(token) : { ads: [], totalCount: 0 };

    return (
        <AdsListClient 
            initialAds={ads} 
            initialTotalCount={totalCount}
            isAdmin={isAdmin} 
        />
    );
}
