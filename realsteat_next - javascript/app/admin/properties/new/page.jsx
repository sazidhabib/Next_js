"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, UploadCloud, Plus, X, Video, ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { ssr: false });

export default function NewPropertyForm() {
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [amenities, setAmenities] = useState(["Infinity Pool", "Gymnasium"]);
    const [newAmenity, setNewAmenity] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("Upcoming");
    const [description, setDescription] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [sqft, setSqft] = useState("");
    const [floors, setFloors] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [dbLocations, setDbLocations] = useState([]);
    const [dbAmenities, setDbAmenities] = useState([]);
    const [landArea, setLandArea] = useState("");
    const [landOrientation, setLandOrientation] = useState("");
    const [frontRoad, setFrontRoad] = useState("");
    const [numUnits, setNumUnits] = useState("");
    const [unitSize, setUnitSize] = useState("");
    const [numBasements, setNumBasements] = useState("");
    const [carParking, setCarParking] = useState("");
    const [locationDetails, setLocationDetails] = useState("");

    useEffect(() => {
        const fetchFormMetadata = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                const [catsRes, locsRes, amensRes] = await Promise.all([
                    fetch(`${apiUrl}/categories`),
                    fetch(`${apiUrl}/locations`),
                    fetch(`${apiUrl}/amenities`)
                ]);
                if (catsRes.ok) setCategories(await catsRes.json());
                if (locsRes.ok) setDbLocations(await locsRes.json());
                if (amensRes.ok) setDbAmenities(await amensRes.json());
            } catch (err) {
                console.error("Failed to fetch metadata", err);
            }
        };
        fetchFormMetadata();
    }, []);

    const handleAddAmenity = () => {
        if (newAmenity.trim()) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity("");
        }
    };

    const handleRemoveAmenity = (indexToRemove) => {
        setAmenities(amenities.filter((_, idx) => idx !== indexToRemove));
    };

    const handleFileSelect = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const allFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(allFiles);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
        setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
            if (newFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...newFiles]);
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                setImagePreviews(prev => [...prev, ...newPreviews]);
            }
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Property title is required.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category_id", selectedCategoryId || "");
            formData.append("is_popular", "false");
            formData.append("status", "active");
            formData.append("location", location);
            formData.append("location_details", locationDetails);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("price", price);
            formData.append("bedrooms", bedrooms);
            formData.append("bathrooms", bathrooms);
            formData.append("sqft", sqft);
            formData.append("floors", floors);
            formData.append("amenities", JSON.stringify(amenities));
            formData.append("land_area", landArea);
            formData.append("land_orientation", landOrientation);
            formData.append("front_road", frontRoad);
            formData.append("num_units", numUnits);
            formData.append("unit_size", unitSize);
            formData.append("num_basements", numBasements);
            formData.append("car_parking", carParking);

            if (videoUrl.trim()) {
                formData.append("video_url", videoUrl.trim());
            }

            for (const file of selectedFiles) {
                formData.append("images", file);
            }

            const res = await fetch(`${apiUrl}/properties`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create property");
            }

            router.push("/admin/properties");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/properties">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Add New Property</h1>
                    <p className="text-muted-foreground mt-1">Fill out the details to create a new property listing.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <form className="divide-y divide-border" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                    {error && (
                        <div className="p-4 mx-6 mt-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Property Title <span className="text-destructive">*</span></label>
                                <input type="text" placeholder="e.g. Amberwood Apartments" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Location <span className="text-destructive">*</span></label>
                                <select 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer"
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {dbLocations.map((loc) => (
                                        <option key={loc.id} value={loc.name}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Location Details</label>
                                <input type="text" placeholder="e.g. Road 12, Block B, Gulshan" value={locationDetails} onChange={(e) => setLocationDetails(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <MapPicker
                                    latitude={latitude}
                                    longitude={longitude}
                                    onChange={(lat, lng) => {
                                        setLatitude(lat);
                                        setLongitude(lng);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Price</label>
                                <input type="text" placeholder="e.g. $509,300 or 'Contact for Price'" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer">
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
                                <textarea rows={4} placeholder="Detailed description of the property..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-y"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 bg-secondary/10">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Property Statistics</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bedrooms</label>
                                <input type="number" min="0" placeholder="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bathrooms</label>
                                <input type="number" min="0" placeholder="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Square Feet</label>
                                <input type="number" min="0" placeholder="e.g. 2500" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Total Floors</label>
                                <input type="text" placeholder="e.g. G + 12" value={floors} onChange={(e) => setFloors(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Land & Building Details</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Land Area</label>
                                <input type="text" placeholder="e.g. 20 Kathas" value={landArea} onChange={(e) => setLandArea(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Land Orientation</label>
                                <input type="text" placeholder="e.g. North, lakeside plot" value={landOrientation} onChange={(e) => setLandOrientation(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Front Road</label>
                                <input type="text" placeholder="e.g. 40 feet" value={frontRoad} onChange={(e) => setFrontRoad(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Number of Units</label>
                                <input type="text" placeholder="e.g. 24" value={numUnits} onChange={(e) => setNumUnits(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Size of Units</label>
                                <input type="text" placeholder="e.g. 3,700 - 4,200 sft" value={unitSize} onChange={(e) => setUnitSize(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Number of Basements</label>
                                <input type="text" placeholder="e.g. 02" value={numBasements} onChange={(e) => setNumBasements(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Car Parking</label>
                                <input type="text" placeholder="e.g. 48" value={carParking} onChange={(e) => setCarParking(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {dbAmenities.map((amenity) => {
                                const isChecked = amenities.includes(amenity.name);
                                return (
                                    <label key={amenity.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-secondary/35 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAmenities([...amenities, amenity.name]);
                                                } else {
                                                    setAmenities(amenities.filter(a => a !== amenity.name));
                                                }
                                            }}
                                            className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                        />
                                        <span className="text-sm text-foreground flex items-center gap-2">
                                            {amenity.icon_url && <img src={amenity.icon_url} alt={amenity.name} className="w-5 h-5 object-cover rounded" />}
                                            {amenity.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 bg-secondary/10">
                        <div className="flex items-center gap-2 border-b border-border pb-2">
                            <ImageIcon size={20} className="text-primary" />
                            <h3 className="text-lg font-bold text-foreground">Property Images</h3>
                        </div>

                        <div className="space-y-4">
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 text-center cursor-pointer bg-background/50 transition-colors"
                            >
                                <UploadCloud size={40} className="mx-auto text-muted-foreground mb-4" />
                                <p className="text-sm font-medium text-foreground">Drag & drop images here, or click to browse</p>
                                <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP (Max 5MB each)</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*" />
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-background">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-2 border-b border-border pb-2">
                            <Video size={20} className="text-primary" />
                            <h3 className="text-lg font-bold text-foreground">Video Tour</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">YouTube Video URL</label>
                                <input
                                    type="url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                                <p className="text-xs text-muted-foreground">Paste a YouTube video URL to add a virtual tour or walkthrough video.</p>
                            </div>

                            {videoUrl && videoUrl.includes("youtube") && (
                                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${videoUrl.includes("v=") ? videoUrl.split("v=")[1]?.split("&")[0] : videoUrl.split("/").pop()}`}
                                        title="Video preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex items-center justify-end gap-4 bg-background">
                        <Link href="/admin/properties">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-8">
                            {isSubmitting ? "Saving..." : "Save Property"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
