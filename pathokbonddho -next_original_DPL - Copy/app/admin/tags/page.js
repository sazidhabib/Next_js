import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import TagsListClient from './TagsListClient';

async function getInitialTags(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/tags`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.tags || data.data || []);
    } catch (err) {
        console.error("Fetch tags error (server):", err);
        return [];
    }
}

export default async function TagsDashboardPage() {
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

    const tags = isAdmin ? await getInitialTags(token) : [];

    return (
        <TagsListClient 
            initialTags={tags} 
            isAdmin={isAdmin} 
        />
    );
}
