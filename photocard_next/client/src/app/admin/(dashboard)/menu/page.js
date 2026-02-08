'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, Link as LinkIcon } from 'lucide-react';
import Modal from '../../../../components/Modal';
import { API_URL } from '../../../../config';

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [linkType, setLinkType] = useState('category'); // 'category', 'url', 'page'
    const [categoryId, setCategoryId] = useState('');
    const [url, setUrl] = useState('');
    const [parentId, setParentId] = useState('');
    const [itemOrder, setItemOrder] = useState(0);

    const fetchMenu = async () => {
        try {
            const response = await fetch(`${API_URL}/menu`);
            const data = await response.json();
            if (response.ok) setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            if (response.ok) setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? 'Updating menu item...' : 'Adding menu item...');
        try {
            const token = localStorage.getItem('token');
            const apiUrl = editingId ? `${API_URL}/menu/${editingId}` : `${API_URL}/menu`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    category_id: linkType === 'category' ? (categoryId || null) : null,
                    url: linkType !== 'category' ? (url || null) : null,
                    parent_id: parentId || null,
                    item_order: itemOrder
                })
            });

            if (response.ok) {
                toast.success('Successfully saved', { id: loadingToast });
                setIsModalOpen(false);
                resetFormState();
                fetchMenu();
            } else {
                toast.error('Failed to save', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving', { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this menu item?')) return;
        const loadingToast = toast.loading('Deleting...');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/menu/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Deleted', { id: loadingToast });
                fetchMenu();
            }
        } catch (error) {
            toast.error('Error deleting', { id: loadingToast });
        }
    };

    const openEdit = (item) => {
        setEditingId(item.id);
        setTitle(item.title);
        setCategoryId(item.category_id || '');
        setUrl(item.url || '');
        setLinkType(item.category_id ? 'category' : 'url'); // Default logic
        setParentId(item.parent_id || '');
        setItemOrder(item.item_order || 0);
        setIsModalOpen(true);
    };

    const resetFormState = () => {
        setEditingId(null);
        setTitle('');
        setLinkType('category');
        setCategoryId('');
        setUrl('');
        setParentId('');
        setItemOrder(menuItems.length);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8">লোড হচ্ছে...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">মেনু ম্যানেজমেন্ট</h1>
                <button onClick={resetFormState} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg">
                    <Plus size={18} /> নতুন মেনু আইটেম
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-500 text-sm">
                            <th className="p-3">শিরোনাম</th>
                            <th className="p-3">ক্যাটাগরি/URL</th>
                            <th className="p-3">অর্ডার</th>
                            <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-600">
                                    {item.parent_id && <span className="text-gray-300 ml-4">↳ </span>}
                                    {item.title}
                                </td>
                                <td className="p-3 text-gray-500 text-sm">
                                    {item.category_name ? <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Category: {item.category_name}</span> : <span>{item.url || '-'}</span>}
                                </td>
                                <td className="p-3 text-gray-500">{item.item_order}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => openEdit(item)} className="text-blue-500"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "মেনু এডিট করুন" : "নতুন মেনু যুক্ত করুন"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">শিরোনাম</label>
                        <input className="w-full border text-gray-500 rounded p-2" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">লিঙ্ক ধরণ</label>
                        <select className="w-full border text-gray-500 rounded p-2" value={linkType} onChange={e => setLinkType(e.target.value)}>
                            <option value="category">ক্যাটাগরি</option>
                            <option value="page">পেইজ (Home, All Frames...)</option>
                            <option value="url">কাস্টম URL</option>
                        </select>
                    </div>

                    {linkType === 'category' && (
                        <div>
                            <label className="block text-sm text-gray-700 font-medium mb-1">ক্যাটাগরি নির্বাচন করুন</label>
                            <select className="w-full border text-gray-500 rounded p-2" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                <option value="">নির্বাচন করুন</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {linkType === 'page' && (
                        <div>
                            <label className="block text-sm text-gray-700 font-medium mb-1">পেইজ নির্বাচন করুন</label>
                            <select className="w-full border text-gray-500 rounded p-2" value={url} onChange={e => setUrl(e.target.value)}>
                                <option value="">নির্বাচন করুন</option>
                                <option value="/">হোম (Home)</option>
                                <option value="/all-frames">সকল ফ্রেম (All Frames)</option>
                                <option value="/popular-frames">জনপ্রিয় ফ্রেম (Popular)</option>
                                <option value="/text-frames">টেক্সট ফ্রেম (Text)</option>
                                <option value="/add-frame">ফ্রেম যুক্ত করুন (Add Frame)</option>
                                <option value="/contact">যোগাযোগ (Contact)</option>
                            </select>
                        </div>
                    )}

                    {linkType === 'url' && (
                        <div>
                            <label className="block text-sm text-gray-700 font-medium mb-1">URL লিখুন</label>
                            <input className="w-full border text-gray-500 rounded p-2" value={url} onChange={e => setUrl(e.target.value)} placeholder="/custom-page" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">প্যারেন্ট আইটেম</label>
                        <select className="w-full border text-gray-500 rounded p-2" value={parentId} onChange={e => setParentId(e.target.value)}>
                            <option value="">None (Top Level)</option>
                            {menuItems.filter(i => !i.parent_id && i.id !== editingId).map(i => (
                                <option key={i.id} value={i.id}>{i.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">অর্ডার</label>
                        <input type="number" className="w-full border text-gray-500 rounded p-2" value={itemOrder} onChange={e => setItemOrder(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded">সেভ করুন</button>
                </form>
            </Modal>
        </div>
    );
}
