"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, Mail, Eye, TrendingUp, FolderOpen } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Dashboard stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Portfolio Items',
      value: stats?.total_portfolio || 0,
      icon: Image,
      color: 'bg-blue-500',
    },
    {
      title: 'New Submissions',
      value: stats?.total_submissions || 0,
      icon: Mail,
      color: 'bg-green-500',
    },
    {
      title: 'Page Views Today',
      value: stats?.page_views_today || 0,
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: 'Top Categories',
      value: stats?.top_categories?.length || 0,
      icon: FolderOpen,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Overview of your website</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {stats?.recent_submissions && stats.recent_submissions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Contact Submissions</h2>
          <div className="space-y-4">
            {stats.recent_submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl"
              >
                <div>
                  <p className="text-white font-medium">{submission.name}</p>
                  <p className="text-zinc-400 text-sm">{submission.email}</p>
                  {submission.service && (
                    <p className="text-zinc-500 text-xs mt-1">{submission.service}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-xs">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.top_categories && stats.top_categories.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Categories</h2>
          <div className="space-y-3">
            {stats.top_categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-white">{category.title}</span>
                </div>
                <span className="text-zinc-400">{category.count} items</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
