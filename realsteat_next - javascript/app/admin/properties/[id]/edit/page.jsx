"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, UploadCloud, Plus, X, Video, ImageIcon, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { ssr: false });

export default function EditPropertyPage() {
    const router = useRouter();
    const params = useParams();
    const propertyId = params.id;
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const [existingImages, setExistingImages] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");
    const [isPopular, setIsPopular] = useState(false);
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [sqft, setSqft] = useState("");
    const [floors, setFloors] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [newAmenity, setNewAmenity] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [propertyRes, categoriesRes, locationsRes, amenitiesRes] = await Promise.all([
                    fetch(`${apiUrl}/properties/${propertyId}`),
                    fetch(`${apiUrl}/categories`),
                    fetch(`${apiUrl}/locations`),
                    fetch(`${apiUrl}/amenities`)
                ]);

                if (!propertyRes.ok) throw new Error("Property not found");

                const property = await propertyRes.json();
                setTitle(property.title || "");
                setLocation(property.location || "");
                setPrice(property.price || "");
                setDescription(property.description || "");
                setStatus(property.status || "active");
                setIsPopular(property.is_popular === 1 || property.is_popular === true);
                setVideoUrl(property.video_url || "");
                setSelectedCategoryId(property.category_id ? String(property.category_id) : "");
                setBedrooms(property.bedrooms ? String(property.bedrooms) : "");
                setBathrooms(property.bathrooms ? String(property.bathrooms) : "");
                setSqft(property.sqft ? String(property.sqft) : "");
                setFloors(property.floors ? String(property.floors) : "");
                setLatitude(property.latitude ? String(property.latitude) : "");
                setLongitude(property.longitude ? String(property.longitude) : "");
                setLandArea(property.land_area || "");
                setLandOrientation(property.land_orientation || "");
                setFrontRoad(property.front_road || "");
                setNumUnits(property.num_units || "");
                setUnitSize(property.unit_size || "");
                setNumBasements(property.num_basements || "");
                setCarParking(property.car_parking || "");
                setLocationDetails(property.location_details || "");
                if (property.amenities) {
                    try {
                        const a = typeof property.amenities === "string" ? JSON.parse(property.amenities) : property.amenities;
                        setAmenities(Array.isArray(a) ? a : []);
                    } catch { setAmenities([]); }
                }

                if (property.images) {
                    try {
                        const imgs = typeof property.images === "string" ? JSON.parse(property.images) : property.images;
                        setExistingImages(Array.isArray(imgs) ? imgs : []);
                    } catch {
                        if (property.image_url) setExistingImages([property.image_url]);
                    }
                } else if (property.image_url) {
                    setExistingImages([property.image_url]);
                }

                if (categoriesRes.ok) {
                    setCategories(await categoriesRes.json());
                }
                if (locationsRes.ok) {
                    setDbLocations(await locationsRes.json());
                }
                if (amenitiesRes.ok) {
                    setDbAmenities(await amenitiesRes.json());
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [apiUrl, propertyId]);

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
            const files = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...files]);

            const previews = files.map((file) => URL.createObjectURL(file));
            setNewPreviews((prev) => [...prev, ...previews]);
        }
    };

    const handleRemoveNewImage = (indexToRemove) => {
        URL.revokeObjectURL(newPreviews[indexToRemove]);
        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setNewPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleRemoveExistingImage = (imgUrl) => {
        setExistingImages((prev) => prev.filter((url) => url !== imgUrl));
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Property title is required.");
            return;
        }

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category_id", selectedCategoryId || "");
            formData.append("is_popular", String(isPopular));
            formData.append("status", status);
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
            } else {
                formData.append("video_url", "");
            }

            // Send existing images as JSON string
            formData.append("existing_images", JSON.stringify(existingImages));

            for (const file of selectedFiles) {
                formData.append("images", file);
            }

            const res = await fetch(`${apiUrl}/properties/${propertyId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update property");
            }

            setSuccess("Property updated successfully!");
            setTimeout(() => router.push("/admin/properties"), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
                Loading property details...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/properties">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Edit Property</h1>
                        <p className="text-muted-foreground mt-1">Update property listing details.</p>
                    </div>
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                    <Save size={16} />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <form className="divide-y divide-border" onSubmit={(e) => e.preventDefault()}>
                    {error && (
                        <div className="p-4 mx-6 mt-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 mx-6 mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm text-center">
                            {success}
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
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="trash">Trash</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <select className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 flex items-end">
                                <label className="flex items-center gap-3 cursor-pointer p-3">
                                    <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
                                    <span className="text-sm font-medium text-foreground">Mark as Popular</span>
                                </label>
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

                    <div className="p-6 md:p-8 space-y-6 bg-secondary/5">
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

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-foreground">Existing Images</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {existingImages.map((imgUrl, index) => (
                                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-background">
                                            <img src={imgUrl} alt="Existing" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => handleRemoveExistingImage(imgUrl)} className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Uploads */}
                        <div className="space-y-4 pt-4">
                            <h4 className="text-sm font-medium text-foreground">Upload New Images</h4>
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 text-center cursor-pointer bg-background/50 transition-colors">
                                <UploadCloud size={40} className="mx-auto text-muted-foreground mb-4" />
                                <p className="text-sm font-medium text-foreground">Click to browse or drag new files here</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*" />
                            </div>

                            {newPreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {newPreviews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-emerald-500/30 bg-emerald-500/5">
                                            <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors">
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
                                <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>
                            {videoUrl && videoUrl.includes("youtube") && (
                                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoUrl.includes("v=") ? videoUrl.split("v=")[1]?.split("&")[0] : videoUrl.split("/").pop()}`} title="Video preview" frameBorder="0" allowFullScreen></iframe>
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
