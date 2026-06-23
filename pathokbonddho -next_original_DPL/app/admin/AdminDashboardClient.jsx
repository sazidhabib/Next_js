'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/app/lib/api';

export default function AdminDashboardClient({ initialStats, user }) {
    const [stats, setStats] = useState(initialStats || {
        news: 0,
        users: 0,
        categories: 0,
        tags: 0,
        authors: 0,
        images: 0
    });
    const [loading, setLoading] = useState(false);

    // Refresh stats if needed, but we have initial data now
    const fetchStats = async () => {
        try {
            const [newsRes, usersRes, menusRes, tagsRes, authorsRes, imagesRes] = await Promise.all([
                api.get('/news?limit=1&status=all'),
                api.get('/users'),
                api.get('/menus'),
                api.get('/tags'),
                api.get('/authors?limit=1'),
                api.get('/images/all?limit=1')
            ]);

            setStats({
                news: newsRes.data.totalCount || 0,
                users: usersRes.data.length || (Array.isArray(usersRes.data.users) ? usersRes.data.users.length : 0),
                categories: menusRes.data.length || (Array.isArray(menusRes.data.data) ? menusRes.data.data.length : 0),
                tags: tagsRes.data.length || (Array.isArray(tagsRes.data.tags) ? tagsRes.data.tags.length : 0),
                authors: authorsRes.data.totalCount || 0,
                images: imagesRes.data.total || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="admin-title-font">
            {/* Header Greeting Banner */}
            <div className="mb-4 p-4 rounded-4 bg-white border border-zinc-200/50 shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold text-slate-800 mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Dashboard</h2>
                    <p className="text-muted mb-0 small">Welcome back, <strong className="text-teal-600">{user?.username || user?.email}</strong>. Here is the latest overview of your portal.</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={fetchStats} className="btn btn-outline-primary d-flex align-items-center gap-2 py-2">
                        <i className="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="row">
                {/* Total News Card */}
                <div className="col-6 col-md-4 mb-4">
                    <div className="card card-hover border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #006a60 !important', height: '100%' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>Total News</span>
                                <h3 className="mb-0 fw-bold text-slate-800" style={{ fontSize: '1.75rem' }}>{stats.news}</h3>
                            </div>
                            <div className="rounded-circle bg-teal-50 d-flex justify-content-center align-items-center text-teal-600" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                <i className="fas fa-newspaper"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Users Card */}
                <div className="col-6 col-md-4 mb-4">
                    <div className="card card-hover border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #4f46e5 !important', height: '100%' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>Total Users</span>
                                <h3 className="mb-0 fw-bold text-slate-800" style={{ fontSize: '1.75rem' }}>{stats.users}</h3>
                            </div>
                            <div className="rounded-circle bg-indigo-50 d-flex justify-content-center align-items-center text-indigo-600" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                <i className="fas fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Authors Card */}
                <div className="col-6 col-md-4 mb-4">
                    <div className="card card-hover border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #7c3aed !important', height: '100%' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>Total Authors</span>
                                <h3 className="mb-0 fw-bold text-slate-800" style={{ fontSize: '1.75rem' }}>{stats.authors}</h3>
                            </div>
                            <div className="rounded-circle bg-purple-50 d-flex justify-content-center align-items-center text-purple-600" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                <i className="fas fa-user-tie"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Card */}
                <div className="col-6 col-md-4 mb-4">
                    <div className="card card-hover border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #0284c7 !important', height: '100%' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>Categories</span>
                                <h3 className="mb-0 fw-bold text-slate-800" style={{ fontSize: '1.75rem' }}>{stats.categories}</h3>
                            </div>
                            <div className="rounded-circle bg-sky-50 d-flex justify-content-center align-items-center text-sky-600" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                <i className="fas fa-th-large"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags Card */}
                <div className="col-6 col-md-4 mb-4">
                    <div className="card card-hover border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #d97706 !important', height: '100%' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>Tags</span>
                                <h3 className="mb-0 fw-bold text-slate-800" style={{ fontSize: '1.75rem' }}>{stats.tags}</h3>
                            </div>
                            <div className="rounded-circle bg-amber-50 d-flex justify-content-center align-items-center text-amber-600" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                <i className="fas fa-tags"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Images Card */}
                <div className="col-6 col-md-4 mb-4">
                    <div className="card card-hover border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #059669 !important', height: '100%' }}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>Total Images</span>
                                <h3 className="mb-0 fw-bold text-slate-800" style={{ fontSize: '1.75rem' }}>{stats.images}</h3>
                            </div>
                            <div className="rounded-circle bg-emerald-50 d-flex justify-content-center align-items-center text-emerald-600" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                <i className="fas fa-images"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="card border-0 shadow-sm mt-2">
                <div className="card-body p-4">
                    <h5 className="fw-bold text-slate-800 mb-3" style={{ fontSize: '1.1rem' }}>Quick Actions</h5>
                    <div className="d-flex gap-3 flex-wrap">
                        <Link href="/admin/news/create" className="btn btn-primary d-flex align-items-center gap-2 py-2">
                            <i className="fas fa-plus"></i> Write Article
                        </Link>
                        <Link href="/admin/menu" className="btn btn-outline-primary d-flex align-items-center gap-2 py-2">
                            <i className="fas fa-compass"></i> Manage Navigation
                        </Link>
                        <Link href="/admin/settings" className="btn btn-outline-secondary d-flex align-items-center gap-2 py-2">
                            <i className="fas fa-cog"></i> System Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
