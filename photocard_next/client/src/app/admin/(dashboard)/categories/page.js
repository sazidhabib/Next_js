'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../../../../components/Modal';
import { API_URL } from '../../../../config';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            if (response.ok) setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? 'Updating category...' : 'Adding category...');
        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `${API_URL}/categories/${editingId}`
                : `${API_URL}/categories`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, parent_id: parentId || null })
            });

            if (response.ok) {
                toast.success(editingId ? 'Category updated successfully' : 'Category added successfully', { id: loadingToast });
                setIsModalOpen(false);
                setEditingId(null);
                setName('');
                setDescription('');
                fetchCategories();
            } else {
                toast.error('Failed to save category', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving category', { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        const loadingToast = toast.loading('Deleting category...');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Category deleted successfully', { id: loadingToast });
                fetchCategories();
            } else {
                toast.error('Failed to delete category', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting category', { id: loadingToast });
        }
    };

    const openEdit = (cat) => {
        setEditingId(cat.id);
        setName(cat.name);
        setDescription(cat.description || '');
        setParentId(cat.parent_id || '');
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setParentId('');
        setIsModalOpen(true);
    };

    const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">ক্যাটাগরি ম্যানেজমেন্ট</h1>
                <button
                    onClick={resetForm}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={18} /> নতুন ক্যাটাগরি
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-500 text-sm">
                            <th className="p-3">নাম (Name)</th>
                            <th className="p-3">Parent</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">বর্ণনা</th>
                            <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            // 1. Build Tree
                            const buildTree = (cats, parentId = null) => {
                                return cats
                                    .filter(c => c.parent_id === parentId) // Get direct children
                                    .map(c => ({
                                        ...c,
                                        children: buildTree(cats, c.id) // Recursively get grandchildren
                                    }));
                            };

                            const tree = buildTree(categories);

                            // 2. Flatten for Table Display with Depth
                            const flattenTree = (nodes, depth = 0) => {
                                let result = [];
                                nodes.forEach(node => {
                                    // Add current node with depth info
                                    result.push({ ...node, depth });
                                    // Recursively add children
                                    if (node.children && node.children.length > 0) {
                                        result = result.concat(flattenTree(node.children, depth + 1));
                                    }
                                });
                                return result;
                            };

                            const flatList = flattenTree(tree);

                            // 3. Filter by Search (if any)
                            // Note: Search breaks hierarchy display usually, so we either search flat or filter tree.
                            // Simple approach: if search exists, just search the flatList ignoring hierarchy for now, or just show matches.
                            const displayList = searchTerm
                                ? categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                : flatList;


                            if (displayList.length === 0) {
                                return <tr><td colSpan="5" className="p-4 text-center text-gray-500">No categories found.</td></tr>;
                            }

                            return displayList.map(cat => (
                                <tr key={cat.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-500">
                                        <div style={{ paddingLeft: searchTerm ? 0 : `${cat.depth * 20}px` }} className="flex items-center gap-2">
                                            {cat.depth > 0 && <span className="text-gray-300">↳</span>}
                                            {cat.name}
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        {cat.parent_id
                                            ? categories.find(c => c.id === cat.parent_id)?.name || 'Unknown'
                                            : <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Root</span>
                                        }
                                    </td>
                                    <td className="p-3 text-gray-500">{cat.slug}</td>
                                    <td className="p-3 text-gray-500">{cat.description}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button onClick={() => openEdit(cat)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Category Name</label>
                        <input className="w-full border text-gray-500 rounded p-2" placeholder="Enter category name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Description</label>
                        <textarea className="w-full border text-gray-500 rounded p-2" placeholder="Enter description" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Parent Category</label>
                        <select
                            className="w-full border text-gray-500 rounded p-2"
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">None (Primary Category)</option>
                            <option value="">None (Root Category)</option>
                            {(() => {
                                // Reuse tree logic for dropdown
                                const buildOptions = (cats, parentId = null, depth = 0) => {
                                    return cats
                                        .filter(c => c.parent_id === parentId)
                                        .map(c => (
                                            <React.Fragment key={c.id}>
                                                <option value={c.id} disabled={c.id === editingId}>
                                                    {'\u00A0'.repeat(depth * 4)}{depth > 0 ? '↳ ' : ''}{c.name}
                                                </option>
                                                {buildOptions(cats, c.id, depth + 1)}
                                            </React.Fragment>
                                        ));
                                };
                                return buildOptions(categories);
                            })()}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded">Save</button>
                </form>
            </Modal>
        </div>
    );
}
