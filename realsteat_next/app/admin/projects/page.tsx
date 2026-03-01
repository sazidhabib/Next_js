"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Trash2, Eye, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Project {
    id: number;
    title: string;
    image_url: string | null;
    status: string;
    category_name: string | null;
    view_count: number;
    created_at: string;
    description: string | null;
}

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}/frames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch projects");
            const data = await res.json();
            setProjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        setDeletingId(id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}/frames/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete");
            }
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "pending":
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "inactive":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            case "rejected":
                return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            case "trash":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    const filteredProjects = projects.filter((p) => {
        const matchesSearch =
            !searchQuery ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = !statusFilter || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all your real estate projects from here.{" "}
                        <span className="text-sm">({filteredProjects.length} total)</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={fetchProjects} disabled={isLoading} className="gap-2">
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Link href="/admin/projects/new">
                        <Button className="gap-2">
                            <Plus size={18} />
                            Add New Project
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex items-center gap-4 bg-background/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects by title or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="rejected">Rejected</option>
                        <option value="trash">Trash</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                            Loading projects...
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <p className="text-lg font-medium mb-1">No projects found</p>
                            <p className="text-sm">
                                {projects.length === 0
                                    ? "Create your first project to get started."
                                    : "Try adjusting your search or filter."}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/30 text-muted-foreground text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium border-b border-border">Thumbnail</th>
                                    <th className="px-6 py-4 font-medium border-b border-border">Title</th>
                                    <th className="px-6 py-4 font-medium border-b border-border">Category</th>
                                    <th className="px-6 py-4 font-medium border-b border-border">Views</th>
                                    <th className="px-6 py-4 font-medium border-b border-border">Status</th>
                                    <th className="px-6 py-4 font-medium border-b border-border text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-3">
                                            {project.image_url ? (
                                                <img
                                                    src={project.image_url}
                                                    alt={project.title}
                                                    className="w-14 h-10 object-cover rounded-md border border-border"
                                                />
                                            ) : (
                                                <div className="w-14 h-10 rounded-md border border-border bg-secondary/30 flex items-center justify-center text-muted-foreground text-xs">
                                                    N/A
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-foreground">{project.title}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">ID: {project.id}</div>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground text-sm">
                                            {project.category_name || "—"}
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground text-sm">
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} /> {project.view_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyle(project.status)}`}
                                            >
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/projects/${project.id}/edit`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    title="Delete"
                                                    onClick={() => handleDelete(project.id)}
                                                    disabled={deletingId === project.id}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                {!isLoading && filteredProjects.length > 0 && (
                    <div className="p-4 border-t border-border bg-background/50 text-sm text-muted-foreground">
                        Showing {filteredProjects.length} of {projects.length} projects
                    </div>
                )}
            </div>
        </div>
    );
}
