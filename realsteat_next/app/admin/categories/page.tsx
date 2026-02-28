"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Trash2, MoreHorizontal, Tags } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    parent_id: number | null;
    parent_name: string | null;
    created_at: string;
}

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({
        name: "",
        description: "",
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const res = await fetch(`${apiUrl}/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (mode: "add" | "edit", category?: Category) => {
        setModalMode(mode);
        if (mode === "edit" && category) {
            setCurrentCategory(category);
        } else {
            setCurrentCategory({ name: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory({ name: "", description: "" });
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const token = localStorage.getItem("token"); // Assuming token is stored here

            const method = modalMode === "add" ? "POST" : "PUT";
            const url = modalMode === "add"
                ? `${apiUrl}/categories`
                : `${apiUrl}/categories/${currentCategory.id}`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: currentCategory.name,
                    description: currentCategory.description,
                    parent_id: currentCategory.parent_id || null
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save category");
            }

            await fetchCategories();
            handleCloseModal();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const token = localStorage.getItem("token");

            const res = await fetch(`${apiUrl}/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete category");
            }

            await fetchCategories();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
                        <Tags className="text-primary" /> Categories
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage project types and property categories.</p>
                </div>
                <Button onClick={() => handleOpenModal("add")} className="flex items-center gap-2">
                    <Plus size={18} />
                    Add Category
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex items-center gap-4 bg-background/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/30 text-muted-foreground text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium border-b border-border">Name / Slug</th>
                                <th className="px-6 py-4 font-medium border-b border-border">Description</th>
                                <th className="px-6 py-4 font-medium border-b border-border text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                        Loading categories...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-destructive">
                                        Error loading categories: {error}
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                        No categories found. Click 'Add Category' to create one.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{category.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1 font-mono">{category.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground max-w-md truncate">
                                            {category.description || "No description provided"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => handleOpenModal("edit", category)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="text-xl font-bold text-foreground">
                                {modalMode === "add" ? "Create New Category" : "Edit Category"}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="h-8 w-8 rounded-full">
                                X
                            </Button>
                        </div>

                        <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Name <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={currentCategory.name || ""}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                    placeholder="e.g. Apartment, Commercial, Villa"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Description</label>
                                <textarea
                                    rows={3}
                                    value={currentCategory.description || ""}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-none"
                                    placeholder="Optional description"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                                <Button type="submit">{modalMode === "add" ? "Create Category" : "Save Changes"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
