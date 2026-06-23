import SettingsClient from './SettingsClient';
import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export default async function SettingsPage() {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    const token = cookieHeader.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    let isAdmin = false;

    if (token) {
        try {
            const user = jwtDecode(token);
            isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.isAdmin;
        } catch (e) {
            console.error("JWT decode error (server) in settings:", e);
        }
    }
    
    return (
        <SettingsClient isAdmin={isAdmin} />
    );
}
