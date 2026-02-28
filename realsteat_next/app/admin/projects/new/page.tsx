"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, UploadCloud, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Category {
    id: number;
    name: string;
}

export default function NewProjectForm() {
    const [amenities, setAmenities] = useState<string[]>(["Infinity Pool", "Gymnasium"]);
    const [newAmenity, setNewAmenity] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                const res = await fetch(`${apiUrl}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleAddAmenity = () => {
        if (newAmenity.trim()) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity("");
        }
    };

    const handleRemoveAmenity = (indexToRemove: number) => {
        setAmenities(amenities.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Add New Project</h1>
                    <p className="text-muted-foreground mt-1">Fill out the details to create a new property listing.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <form className="divide-y divide-border">

                    {/* Basic Information */}
                    <div className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Project Title <span className="text-destructive">*</span></label>
                                <input type="text" placeholder="e.g. The Oasis Residences" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Location <span className="text-destructive">*</span></label>
                                <input type="text" placeholder="e.g. Gulshan, Dhaka" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Price</label>
                                <input type="text" placeholder="e.g. $1,200,000 or 'Contact for Price'" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Status</label>
                                <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer">
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Sold Out">Sold Out</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <select
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-foreground">Description</label>
                                <textarea rows={4} placeholder="Detailed description of the property..." className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-y"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Property Statistics */}
                    <div className="p-6 md:p-8 space-y-6 bg-secondary/10">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Property Statistics</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bedrooms</label>
                                <input type="number" min="0" placeholder="0" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bathrooms</label>
                                <input type="number" min="0" placeholder="0" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Square Feet</label>
                                <input type="number" min="0" placeholder="e.g. 2500" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Total Floors</label>
                                <input type="number" min="0" placeholder="0" className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Features and Media */}
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Amenities array */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-sm text-foreground">
                                        <span>{amenity}</span>
                                        <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                    placeholder="Add a feature (e.g. 24/7 Security)"
                                    className="flex-1 max-w-sm p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                                />
                                <Button type="button" variant="outline" onClick={handleAddAmenity} className="gap-2">
                                    <Plus size={16} /> Add
                                </Button>
                            </div>
                        </div>

                        {/* Image Upload mock */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Property Images</h3>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-background/50 hover:bg-secondary/20 transition-colors cursor-pointer">
                                <UploadCloud size={40} className="text-muted-foreground mb-4" />
                                <h4 className="font-medium text-foreground mb-1">Upload Property Images</h4>
                                <p className="text-sm text-muted-foreground mb-4">Drag and drop images here, or click to browse</p>
                                <Button type="button" variant="outline" size="sm">Select Files</Button>
                                <p className="text-xs text-muted-foreground mt-4">JPG, PNG, WEBP up to 5MB each</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="p-6 md:p-8 bg-secondary/5 flex items-center justify-end gap-4">
                        <Link href="/admin/projects">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="button">Save Project</Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
