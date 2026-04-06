import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import NewsListClient from './NewsListClient';

async function getInitialNews(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/news?page=1&limit=20`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 0 } // Don't cache admin lists or keep them very fresh
        });
        if (!res.ok) return { news: [], totalPages: 1 };
        const data = await res.json();
        return {
            news: data.news || data.rows || data.data || (Array.isArray(data) ? data : []),
            totalPages: data.totalPages || 1
        };
    } catch (err) {
        console.error("Fetch news error (server):", err);
        return { news: [], totalPages: 1 };
    }
}

export default async function NewsDashboardPage() {
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

    const { news, totalPages } = isAdmin ? await getInitialNews(token) : { news: [], totalPages: 1 };

    return (
        <NewsListClient
            initialNews={news}
            initialTotalPages={totalPages}
            isAdmin={isAdmin}
        />
    );
}
