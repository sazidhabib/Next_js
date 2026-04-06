import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import AdminDashboardClient from './AdminDashboardClient';

async function getDashboardStats(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const [newsRes, usersRes, menusRes, tagsRes] = await Promise.all([
            fetch(`${API_URL}/news?limit=1`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 0 }
            }),
            fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 0 }
            }),
            fetch(`${API_URL}/menus`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 0 }
            }),
            fetch(`${API_URL}/tags`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 0 }
            })
        ]);

        const newsData = newsRes.ok ? await newsRes.json() : { totalCount: 0 };
        const usersData = usersRes.ok ? await usersRes.json() : [];
        const menusData = menusRes.ok ? await menusRes.json() : { data: [] };
        const tagsData = tagsRes.ok ? await tagsRes.json() : { tags: [] };

        return {
            news: newsData.totalCount || 0,
            users: Array.isArray(usersData) ? usersData.length : (usersData.users?.length || 0),
            categories: (menusData.data || menusData || []).length,
            tags: (tagsData.tags || tagsData || []).length
        };
    } catch (err) {
        console.error("Dashboard stats fetch error (server):", err);
        return { news: 0, users: 0, categories: 0, tags: 0 };
    }
}

export default async function AdminDashboardPage() {
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
            console.error("JWT decode error (server dashboard):", e);
        }
    }

    const stats = isAdmin ? await getDashboardStats(token) : { news: 0, users: 0, categories: 0, tags: 0 };

    return (
        <AdminDashboardClient 
            initialStats={stats} 
            user={user} 
        />
    );
}
