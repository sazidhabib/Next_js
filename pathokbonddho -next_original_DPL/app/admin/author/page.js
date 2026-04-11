import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import AuthorsListClient from './AuthorsListClient';

async function getInitialAuthors(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/authors?page=1&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return { authors: [], pagination: null };
        const data = await res.json();
        
        const authorsList = data.authors || data.data || (Array.isArray(data) ? data : []);
        const pagination = {
            currentPage: data.currentPage || data.page || 1,
            totalPages: data.totalPages || 1,
            totalCount: data.totalCount || data.count || authorsList.length || 0,
            hasNext: data.hasNext || false,
            hasPrev: data.hasPrev || false
        };
        
        return { authors: authorsList, pagination };
    } catch (err) {
        console.error("Fetch authors error (server):", err);
        return { authors: [], pagination: null };
    }
}

export default async function AuthorDashboardPage() {
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
            console.error("JWT decode error (server author):", e);
        }
    }

    const { authors, pagination } = isAdmin ? await getInitialAuthors(token) : { authors: [], pagination: null };

    return (
        <AuthorsListClient 
            initialAuthors={authors} 
            initialPagination={pagination}
            isAdmin={isAdmin} 
        />
    );
}
