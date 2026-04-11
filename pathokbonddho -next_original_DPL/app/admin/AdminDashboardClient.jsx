'use client';

import React, { useState, useEffect } from 'react';
import api from '@/app/lib/api';

export default function AdminDashboardClient({ initialStats, user }) {
    const [stats, setStats] = useState(initialStats || {
        news: 0,
        users: 0,
        categories: 0,
        tags: 0
    });
    const [loading, setLoading] = useState(false);

    // Refresh stats if needed, but we have initial data now
    const fetchStats = async () => {
        try {
            const [newsRes, usersRes, menusRes, tagsRes] = await Promise.all([
                api.get('/news?limit=1'),
                api.get('/users'),
                api.get('/menus'),
                api.get('/tags')
            ]);

            setStats({
                news: newsRes.data.totalCount || 0,
                users: usersRes.data.length || (Array.isArray(usersRes.data.users) ? usersRes.data.users.length : 0),
                categories: menusRes.data.length || (Array.isArray(menusRes.data.data) ? menusRes.data.data.length : 0),
                tags: tagsRes.data.length || (Array.isArray(tagsRes.data.tags) ? tagsRes.data.tags.length : 0)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div>
            <h1 className="mb-4">Dashboard</h1>
            <p className="mb-4">Welcome, {user?.username || user?.email}!</p>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card bg-primary text-white shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase mb-3" style={{fontSize: '0.8rem', opacity: 0.8}}>Total News</h5>
                            <h2 className="mb-0">{stats.news}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card bg-success text-white shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase mb-3" style={{fontSize: '0.8rem', opacity: 0.8}}>Total Users</h5>
                            <h2 className="mb-0">{stats.users}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card bg-info text-white shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase mb-3" style={{fontSize: '0.8rem', opacity: 0.8}}>Categories</h5>
                            <h2 className="mb-0">{stats.categories}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card bg-warning text-white shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase mb-3" style={{fontSize: '0.8rem', opacity: 0.8}}>Tags</h5>
                            <h2 className="mb-0">{stats.tags}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
