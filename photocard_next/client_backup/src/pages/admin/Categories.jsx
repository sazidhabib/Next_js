import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { API_URL } from '../../config';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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
                body: JSON.stringify({ name, description })
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
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setDescription('');
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
                            <th className="p-3">নাম</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">বর্ণনা</th>
                            <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(cat => (
                            <tr key={cat.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{cat.name}</td>
                                <td className="p-3 text-gray-500">{cat.slug}</td>
                                <td className="p-3 text-gray-500">{cat.description}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => openEdit(cat)} className="text-blue-500"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-500"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category Name</label>
                        <input className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea className="w-full border rounded p-2" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded">Save</button>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
