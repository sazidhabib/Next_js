"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, RefreshCw, UploadCloud, X, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminAmenitiesPage() {
    const [amenities, setAmenities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [newName, setNewName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [editingAmenity, setEditingAmenity] = useState(null);
    const fileInputRef = useRef(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    const fetchAmenities = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${apiUrl}/amenities`);
            if (!res.ok) throw new Error("Failed to fetch amenities");
            const data = await res.json();
            setAmenities(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePreview = () => {
        setSelectedFile(null);
        if (previewUrl) {
            if (!editingAmenity || previewUrl !== editingAmenity.icon_url) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl("");
        }
    };

    const startEdit = (amenity) => {
        setEditingAmenity(amenity);
        setNewName(amenity.name);
        setPreviewUrl(amenity.icon_url || "");
        setSelectedFile(null);
    };

    const cancelEdit = () => {
        setEditingAmenity(null);
        setNewName("");
        handleRemovePreview();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", newName.trim());
            if (selectedFile) {
                formData.append("icon", selectedFile);
            }

            let res;
            if (editingAmenity) {
                if (!selectedFile && editingAmenity.icon_url) {
                    formData.append("icon_url", editingAmenity.icon_url);
                }
                res = await fetch(`${apiUrl}/amenities/${editingAmenity.id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                res = await fetch(`${apiUrl}/amenities`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save amenity");
            }

            setNewName("");
            setEditingAmenity(null);
            handleRemovePreview();
            fetchAmenities();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this amenity?")) return;
        setError("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}/amenities/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete amenity");
            }

            setAmenities(prev => prev.filter(a => a.id !== id));
            if (editingAmenity && editingAmenity.id === id) {
                cancelEdit();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Amenities</h1>
                <p className="text-muted-foreground mt-1">Manage predefined amenities and icons.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form column */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-foreground">
                            {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Amenity Name <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Swimming Pool"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Amenity Icon / Image</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border border-dashed border-border hover:border-primary rounded-lg p-6 text-center cursor-pointer bg-background/50 transition-colors"
                                >
                                    <UploadCloud size={30} className="mx-auto text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Click to upload icon</span>
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                                </div>

                                {previewUrl && (
                                    <div className="relative group aspect-video rounded-lg overflow-hidden border border-border mt-2">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={handleRemovePreview} className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {editingAmenity && (
                                    <Button type="button" variant="outline" className="flex-1" onClick={cancelEdit}>
                                        Cancel
                                    </Button>
                                )}
                                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : (editingAmenity ? "Save Changes" : "Add Amenity")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Listing column */}
                <div className="lg:col-span-2 space-y-4">
                    {error && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
                                    Loading amenities...
                                </div>
                            ) : amenities.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    No amenities added yet. Create one on the left.
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-medium border-b border-border">Icon</th>
                                            <th className="px-6 py-4 font-medium border-b border-border">Name</th>
                                            <th className="px-6 py-4 font-medium border-b border-border text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {amenities.map((amenity) => (
                                            <tr key={amenity.id} className="hover:bg-secondary/5 transition-colors group">
                                                <td className="px-6 py-3">
                                                    {amenity.icon_url ? (
                                                        <img src={amenity.icon_url} alt={amenity.name} className="w-10 h-10 object-cover rounded border border-border" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded border border-border bg-secondary/30 flex items-center justify-center text-muted-foreground text-xs font-bold">
                                                            A
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="font-medium text-foreground">{amenity.name}</span>
                                                </td>
                                                <td className="px-6 py-3 text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                                                        onClick={() => startEdit(amenity)}
                                                    >
                                                        <Edit3 size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                                                        onClick={() => handleDelete(amenity.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
