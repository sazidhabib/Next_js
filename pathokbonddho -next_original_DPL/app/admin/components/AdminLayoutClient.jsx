'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';

export default function AdminLayoutClient({ children, user }) {
    const { loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Auto-expand sub-menus based on current path
    useEffect(() => {
        if (pathname?.startsWith('/admin/news') || pathname?.startsWith('/admin/photo-news') || pathname?.startsWith('/admin/video-news')) {
            setIsNewsOpen(true);
        }
        if (pathname?.startsWith('/admin/album') || pathname?.startsWith('/admin/photos')) {
            setIsGalleryOpen(true);
        }
    }, [pathname]);

    const isActiveRoute = (path) => {
        if (!pathname) return false;
        const normalizedPathname = pathname.replace(/\/$/, '') || '/';
        const [targetPath, targetQuery] = path.split('?');
        const normalizedTargetPath = targetPath.replace(/\/$/, '') || '/';

        if (targetQuery) {
            const params = new URLSearchParams(targetQuery);
            const type = params.get('type');
            if (normalizedPathname === normalizedTargetPath && searchParams.get('type') === type) {
                return true;
            }
            return false;
        }

        if (normalizedTargetPath === '/admin/news' && searchParams.get('type')) {
            return false;
        }

        return normalizedPathname === normalizedTargetPath;
    };

    const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin' || user?.isAdmin;

    useEffect(() => {
        if (!loading && (!user || !isAdminUser)) {
            router.push('/login');
        }
    }, [user, loading, router, isAdminUser]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user || !isAdminUser) {
        return null;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Top Navbar */}
            <header className="navbar navbar-expand navbar-dark bg-dark sticky-top p-0 shadow">
                <Link href="/admin" className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">
                    Admin Panel
                </Link>
                <button
                    className="navbar-toggler position-absolute d-md-none collapsed"
                    type="button"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="navbar-nav ms-auto me-3">
                    <div className="nav-item text-nowrap">
                        <button 
                            className="btn btn-link nav-link px-3 text-danger border-0" 
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="d-flex flex-grow-1">
                <aside
                    className={`bg-dark text-white p-0 ${isSidebarOpen ? '' : 'd-none d-md-block'}`}
                    style={{ 
                        width: '260px', 
                        minHeight: 'calc(100vh - 48px)', 
                        overflowY: 'auto',
                        flexShrink: 0,
                        zIndex: 1030
                    }}
                >
                    <ul className="nav flex-column p-3" style={{ fontSize: '0.95rem' }}>
                        <li className={`nav-item py-1 ${isActiveRoute('/admin') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin" className="nav-link text-white px-3">
                                Dashboard
                            </Link>
                        </li>

                        <li className={`nav-item py-1 ${isActiveRoute('/admin/menu') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/menu" className="nav-link text-white px-3">
                                Menu
                            </Link>
                        </li>


                        <li className={`nav-item py-1 ${isActiveRoute('/admin/about') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/about" className="nav-link text-white px-3">
                                About
                            </Link>
                        </li>


                        <li className={`nav-item py-1 ${isActiveRoute('/admin/tags') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/tags" className="nav-link text-white px-3">
                                Tags
                            </Link>
                        </li>

                        <li className={`nav-item py-1 ${isActiveRoute('/admin/author') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/author" className="nav-link text-white px-3">
                                Author
                            </Link>
                        </li>

                        <li className={`nav-item py-1 ${isActiveRoute('/admin/ads') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/ads" className="nav-link text-white px-3">
                                Ads
                            </Link>
                        </li>

                        <li className={`nav-item py-1 ${isActiveRoute('/admin/design') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/design" className="nav-link text-white px-3">
                                Design
                            </Link>
                        </li>


                        {/* News Sections (collapsible) */}
                        <li className="nav-item py-1">
                            <div
                                className="nav-link text-warning d-flex justify-content-between align-items-center px-3"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsNewsOpen(!isNewsOpen)}
                            >
                                <span className="fs-5 fw-bold">News Sections</span>
                                <i className={`fas fa-chevron-${isNewsOpen ? 'down' : 'right'}`}></i>
                            </div>
                            <div style={{ display: isNewsOpen ? 'block' : 'none' }}>
                                <ul className="nav flex-column ms-3">
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/news/create') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/news/create" className="nav-link text-white px-3 fw-bold">
                                            + News Create
                                        </Link>
                                    </li>
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/news') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/news" className="nav-link text-white px-3">
                                            All News
                                        </Link>
                                    </li>
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/news?type=photo') || pathname?.includes('/admin/photo-news') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/news?type=photo" className="nav-link text-white px-3">
                                            Photo News
                                        </Link>
                                    </li>
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/news?type=video') || pathname?.includes('/admin/video-news') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/news?type=video" className="nav-link text-white px-3">
                                            Video News
                                        </Link>
                                    </li>
                                    <hr className="bg-secondary my-1 border-0" style={{height: '1px'}} />
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/photo-news/create') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/photo-news/create" className="nav-link text-white px-3">
                                            Photo News Create
                                        </Link>
                                    </li>
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/video-news/create') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/video-news/create" className="nav-link text-white px-3">
                                            Video News Create
                                        </Link>
                                    </li>
                                    <li className={`nav-item py-1 ${pathname?.includes('/admin/news/edit') || pathname?.includes('/admin/photo-news/edit') || pathname?.includes('/admin/video-news/edit') ? 'bg-secondary rounded' : ''}`}>
                                        <span className="nav-link text-secondary px-3" style={{ cursor: 'default' }}>
                                            Edit Module Active
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Photo Gallery (collapsible) */}
                        <li className="nav-item py-1">
                            <div
                                className="nav-link text-warning d-flex justify-content-between align-items-center px-3"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                            >
                                <span className="fs-5 fw-bold">Photo Gallery</span>
                                <i className={`fas fa-chevron-${isGalleryOpen ? 'down' : 'right'}`}></i>
                            </div>
                            <div style={{ display: isGalleryOpen ? 'block' : 'none' }}>
                                <ul className="nav flex-column ms-3">
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/album') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/album" className="nav-link text-white px-3">
                                            Album
                                        </Link>
                                    </li>
                                    <li className={`nav-item py-1 ${isActiveRoute('/admin/photos') ? 'bg-secondary rounded' : ''}`}>
                                        <Link href="/admin/photos" className="nav-link text-white px-3">
                                            Photos
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>



                        <li className={`nav-item py-1 ${isActiveRoute('/admin/page-layout') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/page-layout" className="nav-link text-white px-3">
                                PageLayout
                            </Link>
                        </li>

                        <li className={`nav-item py-1 ${isActiveRoute('/admin/users') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/users" className="nav-link text-white px-3">
                                <i className="fas fa-users me-2"></i>Users
                            </Link>
                        </li>

                        <li className={`nav-item py-1 mt-auto ${isActiveRoute('/admin/settings') ? 'bg-secondary rounded' : ''}`}>
                            <Link href="/admin/settings" className="nav-link text-white px-3">
                                <i className="fas fa-cog me-2"></i>Settings
                            </Link>
                        </li>
                    </ul>
                </aside>

                <main className="flex-grow-1 bg-light" style={{ minWidth: 0 }}>
                    <div className="p-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
