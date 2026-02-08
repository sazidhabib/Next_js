'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Upload, Check, Loader } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';
import ProtectedRoute from '../../components/ProtectedRoute';

const AddFrameContent = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();

    const [dragActive, setDragActive] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        image: null
    });
    const [categories, setCategories] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Auth & Categories Check
    useEffect(() => {
        if (!authLoading && !user) {
            toast.error('অনুগ্রহ করে লগইন করুন');
        }

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/categories`);
                if (response.ok) setCategories(await response.json());
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [user, authLoading, router]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type !== "image/png") {
            toast.error('শুধুমাত্র PNG ফাইল আপলোড করুন');
            return;
        }
        setFormData({ ...formData, image: file });
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.image) {
            toast.error('সব তথ্য পূরণ করুন (ছবি, শিরোনাম)');
            return;
        }

        setSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category_id', formData.category_id);
        data.append('image', formData.image);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/frames`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('ফ্রেম সফলভাবে আপলোড হয়েছে!');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                toast.error(result.message || 'আপলোড ব্যর্থ হয়েছে');
            }
        } catch (error) {
            console.error('Error uploading frame:', error);
            toast.error('সার্ভারে সমস্যা হয়েছে');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <SectionHeader title="নতুন ফ্রেম আপলোড করুন" subtitle="আপনার ডিজাইনটি সবার সাথে শেয়ার করুন" />

                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
                    <div className="mb-8 p-4 bg-orange-50 text-orange-800 rounded-lg border border-orange-100 flex gap-3 text-sm">
                        <span className="text-xl">💡</span>
                        <p>টিপস: শুধুমাত্র স্বচ্ছ ব্যাকগ্রাউন্ডের (Transparent) .PNG ফাইল আপলোড করুন। সাইজ ১০৮০x১০৮০ পিক্সেল হলে ভালো হয়।</p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* File Upload Area */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">ফ্রেমের ছবি (PNG)</label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragActive ? 'border-primary bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".png"
                                    onChange={handleFileChange}
                                />

                                {previewUrl ? (
                                    <div className="flex flex-col items-center">
                                        <img src={previewUrl} alt="Preview" className="h-48 object-contain mb-4 border rounded" />
                                        <p className="text-primary font-semibold">ছবি নির্বাচিত হয়েছে</p>
                                        <p className="text-xs text-gray-500">{formData.image?.name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                            <Upload size={32} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700">এখানে ক্লিক করে ছবি বাছুন</p>
                                            <p className="text-xs text-gray-400 mt-1">অথবা ড্র্যাগ করে আনুন</p>
                                        </div>
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-bold">
                                            শুধুমাত্র PNG
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">ফ্রেমের শিরোনাম</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="যেমন: বিজয় দিবসের ফ্রেম"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">ক্যাটাগরি</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-600"
                                >
                                    <option value="">ক্যাটাগরি নির্ধারণ করুন (ঐচ্ছিক)</option>
                                    {categories
                                        .filter(c => !c.parent_id)
                                        .map(parent => (
                                            <React.Fragment key={parent.id}>
                                                <option value={parent.id}>{parent.name}</option>
                                                {categories
                                                    .filter(child => child.parent_id === parent.id)
                                                    .map(child => (
                                                        <option key={child.id} value={child.id}>&nbsp;&nbsp;↳ {child.name}</option>
                                                    ))
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">পদবি / বিস্তারিত (অপশনাল)</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="যেমন: নিচে নাম ও ছবি থাকবে"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-4 bg-primary hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 text-lg ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? <Loader className="animate-spin" /> : <Check size={24} />}
                            {submitting ? 'আপলোড হচ্ছে...' : 'ফ্রেম জমা দিন'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default function AddFramePage() {
    return (
        <ProtectedRoute allowedRoles={['user']}>
            <AddFrameContent />
        </ProtectedRoute>
    );
}
