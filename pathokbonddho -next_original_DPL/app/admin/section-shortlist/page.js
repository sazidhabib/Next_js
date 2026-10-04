import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import SectionShortlistClient from './SectionShortlistClient';

export const metadata = {
    title: 'Homepage Section 1 Short List | Control Center',
};

async function getInitialLayout(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/layout`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 0 }
        });
        if (!res.ok) return null;
        const allPages = await res.json();
        const pages = Array.isArray(allPages) ? allPages : (allPages?.data || []);
        
        const homePage = pages.find(p => p.name?.toLowerCase() === 'home') || (pages.length > 0 ? pages[0] : null);
        if (!homePage) return null;

        const detailRes = await fetch(`${API_URL}/layout/${homePage.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 0 }
        });
        if (!detailRes.ok) return null;
        return await detailRes.json();
    } catch (err) {
        console.error("Fetch initial layout error (server):", err);
        return null;
    }
}

export default async function SectionShortlistPage() {
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
            console.error("JWT decode error (server):", e);
        }
    }

    const initialLayout = isAdmin ? await getInitialLayout(token) : null;

    return (
        <SectionShortlistClient
            initialLayout={initialLayout}
            isAdmin={isAdmin}
            user={user}
        />
    );
}
