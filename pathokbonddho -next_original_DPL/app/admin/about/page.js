import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import AboutListClient from './AboutListClient';

async function getInitialAbout(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/about`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Fetch about error (server):", err);
        return null;
    }
}

export default async function AboutDashboardPage() {
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
            console.error("JWT decode error (server about):", e);
        }
    }

    const aboutData = isAdmin ? await getInitialAbout(token) : null;

    return (
        <AboutListClient 
            initialAbout={aboutData} 
            isAdmin={isAdmin} 
        />
    );
}
