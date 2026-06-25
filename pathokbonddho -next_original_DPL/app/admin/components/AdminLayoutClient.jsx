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

    // Initial check for screen width to close sidebar on mobile
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    // Auto-close sidebar on route change on mobile
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

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
        <div className="d-flex flex-column min-vh-100 admin-workspace-bg">
            {/* Top Navbar */}
            <header className="navbar navbar-expand sticky-top p-0 shadow-sm" style={{ backgroundColor: '#0d131f', height: '56px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="d-flex align-items-center px-4 w-100 h-100">
                    <button
                        className="border-0 text-white bg-transparent me-3 p-0 hover:text-teal-400 transition-colors"
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ fontSize: '1.25rem', cursor: 'pointer', outline: 'none' }}
                        title="Toggle Sidebar"
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <Link href="/admin" className="navbar-brand me-0 p-0 fs-6 text-white fw-bold d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
                        <i className="fas fa-shield-alt text-teal-400"></i>
                        <span>Control Center</span>
                    </Link>

                    <div className="navbar-nav ms-auto">
                        <div className="nav-item text-nowrap">
                            <button
                                className="btn btn-link nav-link px-3 text-white-50 border-0 hover:text-white d-flex align-items-center gap-2"
                                onClick={handleLogout}
                                style={{ textDecoration: 'none', fontSize: '0.875rem' }}
                            >
                                <i className="fas fa-sign-out-alt text-danger"></i>
                                <span className="d-none d-sm-inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="d-flex flex-grow-1">
                {/* Mobile Sidebar Overlay Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="d-md-none position-fixed start-0 w-100"
                        style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1040,
                            top: '56px',
                            height: 'calc(100vh - 56px)'
                        }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`text-white p-0 admin-sidebar ${isSidebarOpen ? 'sidebar-open' : 'd-md-none'}`}
                    style={{
                        position: 'sticky',
                        top: '56px',
                        width: '260px',
                        height: 'calc(100vh - 56px)',
                        overflowY: 'auto',
                        flexShrink: 0,
                        zIndex: 1030,
                        backgroundColor: '#0d131f',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                >
                    {/* User Profile Widget */}
                    <div className="px-4 py-4 border-bottom border-zinc-800/30 mb-2 d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-teal-500/10 border border-teal-500/20 d-flex justify-content-center align-items-center font-bold text-teal-400 shadow-sm" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            {user?.username ? user.username[0].toUpperCase() : 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <h6 className="mb-0 text-white text-truncate font-semibold" style={{ fontSize: '0.875rem' }}>{user?.username || 'Admin User'}</h6>
                            <span className="text-uppercase text-teal-400 font-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>{user?.role || 'Administrator'}</span>
                        </div>
                    </div>

                    <ul className="nav flex-column p-3 gap-1" style={{ fontSize: '0.875rem' }}>
                        <div className="sidebar-category-header">General</div>
                        <li className="nav-item">
                            <Link href="/admin" className={`sidebar-link ${isActiveRoute('/admin') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-th-large me-2"></i> Dashboard
                            </Link>
                        </li>

                        <div className="sidebar-category-header">Site Architecture</div>
                        <li className="nav-item">
                            <Link href="/admin/menu" className={`sidebar-link ${isActiveRoute('/admin/menu') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-compass me-2"></i> Menu Settings
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/page-layout" className={`sidebar-link ${isActiveRoute('/admin/page-layout') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-columns me-2"></i> Page Layout
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/design" className={`sidebar-link ${isActiveRoute('/admin/design') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-paint-brush me-2"></i> Design & Theme
                            </Link>
                        </li>

                        <div className="sidebar-category-header">Content Management</div>
                        {/* News Sections (collapsible) */}
                        <li className="nav-item">
                            <div
                                className="sidebar-link d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsNewsOpen(!isNewsOpen)}
                            >
                                <span className="d-flex align-items-center">
                                    <i className="fas fa-newspaper me-2"></i> News Articles
                                </span>
                                <i 
                                    className="fas fa-chevron-right" 
                                    style={{ 
                                        fontSize: '0.75rem',
                                        transition: 'transform 0.2s ease',
                                        transform: isNewsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                        color: 'currentColor'
                                    }}
                                ></i>
                            </div>
                            <div style={{ display: isNewsOpen ? 'block' : 'none' }}>
                                <ul className="nav flex-column ms-3 mt-1 gap-1">
                                    <li className="nav-item">
                                        <Link href="/admin/news/create" className={`sidebar-link py-2 ${isActiveRoute('/admin/news/create') ? 'sidebar-link-active' : ''}`}>
                                            <i className="fas fa-plus me-2" style={{ fontSize: '0.7rem' }}></i> Create Article
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/admin/news" className={`sidebar-link py-2 ${isActiveRoute('/admin/news') ? 'sidebar-link-active' : ''}`}>
                                            <i className="fas fa-list me-2" style={{ fontSize: '0.7rem' }}></i> All Articles
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/admin/photo-news/create" className={`sidebar-link py-2 ${isActiveRoute('/admin/photo-news/create') ? 'sidebar-link-active' : ''}`}>
                                            <i className="fas fa-camera me-2" style={{ fontSize: '0.7rem' }}></i> Photo News
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/admin/video-news/create" className={`sidebar-link py-2 ${isActiveRoute('/admin/video-news/create') ? 'sidebar-link-active' : ''}`}>
                                            <i className="fas fa-video me-2" style={{ fontSize: '0.7rem' }}></i> Video News
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Photo Gallery (collapsible) */}
                        <li className="nav-item">
                            <div
                                className="sidebar-link d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                            >
                                <span className="d-flex align-items-center">
                                    <i className="fas fa-images me-2"></i> Galleries
                                </span>
                                <i 
                                    className="fas fa-chevron-right" 
                                    style={{ 
                                        fontSize: '0.75rem',
                                        transition: 'transform 0.2s ease',
                                        transform: isGalleryOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                        color: 'currentColor'
                                    }}
                                ></i>
                            </div>
                            <div style={{ display: isGalleryOpen ? 'block' : 'none' }}>
                                <ul className="nav flex-column ms-3 mt-1 gap-1">
                                    <li className="nav-item">
                                        <Link href="/admin/album" className={`sidebar-link py-2 ${isActiveRoute('/admin/album') ? 'sidebar-link-active' : ''}`}>
                                            <i className="fas fa-folder me-2" style={{ fontSize: '0.7rem' }}></i> Albums
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/admin/photos" className={`sidebar-link py-2 ${isActiveRoute('/admin/photos') ? 'sidebar-link-active' : ''}`}>
                                            <i className="fas fa-image me-2" style={{ fontSize: '0.7rem' }}></i> Photos
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="nav-item">
                            <Link href="/admin/tags" className={`sidebar-link ${isActiveRoute('/admin/tags') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-tags me-2"></i> Tags List
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/author" className={`sidebar-link ${isActiveRoute('/admin/author') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-pen-nib me-2"></i> Authors
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/about" className={`sidebar-link ${isActiveRoute('/admin/about') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-info-circle me-2"></i> About Section
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/ads" className={`sidebar-link ${isActiveRoute('/admin/ads') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-ad me-2"></i> Advertisement
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/photocard-stats" className={`sidebar-link ${isActiveRoute('/admin/photocard-stats') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-image me-2"></i> Photocard Stats
                            </Link>
                        </li>

                        <div className="sidebar-category-header">System</div>
                        <li className="nav-item">
                            <Link href="/admin/users" className={`sidebar-link ${isActiveRoute('/admin/users') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-users-cog me-2"></i> Users
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/settings" className={`sidebar-link ${isActiveRoute('/admin/settings') ? 'sidebar-link-active' : ''}`}>
                                <i className="fas fa-cog me-2"></i> Settings
                            </Link>
                        </li>
                    </ul>
                </aside>

                <main className="flex-grow-1" style={{ minWidth: 0, backgroundColor: '#f8fafc' }}>
                    <div className="p-4" style={{ minHeight: 'calc(100vh - 56px)' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
