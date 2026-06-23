import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import PhotosListClient from './PhotosListClient';

async function getInitialPhotosData(token) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
        const [imagesRes, albumsRes] = await Promise.all([
            fetch(`${API_URL}/all/images?page=1&limit=20`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 0 }
            }),
            fetch(`${API_URL}/albums?status=active`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 0 }
            })
        ]);

        const imagesData = imagesRes.ok ? await imagesRes.json() : { images: [] };
        const albumsData = albumsRes.ok ? await albumsRes.json() : [];

        return {
            images: imagesData.images || [],
            pagination: imagesData.pagination || { totalPages: 1, totalCount: 0 },
            albums: Array.isArray(albumsData) ? albumsData : (albumsData.albums || [])
        };
    } catch (err) {
        console.error("Fetch photos data error (server):", err);
        return { images: [], pagination: { totalPages: 1, totalCount: 0 }, albums: [] };
    }
}

export default async function PhotosDashboardPage() {
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

    const { images, pagination, albums } = isAdmin ? await getInitialPhotosData(token) : { images: [], pagination: { totalPages: 1, totalCount: 0 }, albums: [] };

    return (
        <PhotosListClient 
            initialImages={images} 
            initialAlbums={albums}
            initialTotalPages={pagination.totalPages}
            initialTotalCount={pagination.totalCount}
            isAdmin={isAdmin} 
        />
    );
}
