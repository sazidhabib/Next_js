import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import AlbumListClient from './AlbumListClient';

async function getInitialAlbums(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const res = await fetch(`${API_URL}/albums?page=1`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { revalidate: 0 }
        });
        if (!res.ok) return { albums: [], totalPages: 1 };
        const data = await res.json();
        
        if (Array.isArray(data)) {
            return { albums: data, totalPages: data.totalPages || 1 };
        } else if (data.albums) {
            return { albums: data.albums, totalPages: data.totalPages || 1 };
        }
        return { albums: [], totalPages: 1 };
    } catch (err) {
        console.error("Fetch albums error (server):", err);
        return { albums: [], totalPages: 1 };
    }
}

export default async function AlbumDashboardPage() {
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
            console.error("JWT decode error (server album):", e);
        }
    }

    const { albums, totalPages } = isAdmin ? await getInitialAlbums(token) : { albums: [], totalPages: 1 };

    return (
        <AlbumListClient 
            initialAlbums={albums} 
            initialTotalPages={totalPages}
            isAdmin={isAdmin} 
        />
    );
}
