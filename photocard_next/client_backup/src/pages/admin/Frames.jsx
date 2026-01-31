import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Trash2, Plus, Edit2, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import Modal from '../../components/Modal';
import { API_URL } from '../../config';

const Frames = () => {
    const [frames, setFrames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'pending', 'rejected', 'trash'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [isPopular, setIsPopular] = useState(false);
    const [status, setStatus] = useState('active');

    const fetchAll = async () => {
        try {
            const [framesRes, catsRes] = await Promise.all([
                fetch(`${API_URL}/frames`),
                fetch(`${API_URL}/categories`)
            ]);

            if (framesRes.ok) setFrames(await framesRes.json());
            if (catsRes.ok) setCategories(await catsRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            const token = localStorage.getItem('token');
            // We need to fetch the existing frame data first to preserve other fields, 
            // OR the backend update should be partial. The current backend implementation requires all fields for update usually 
            // but let's check if we can send just status. 
            // The current updateFrame controller expects all fields.
            // A quick hack is to find the frame in local state, and send all its dat along with new status.

            const frame = frames.find(f => f.id === id);
            if (!frame) return;

            const formData = new FormData();
            formData.append('title', frame.title);
            formData.append('image_url', frame.image_url); // Send existing URL
            if (frame.category_id) formData.append('category_id', frame.category_id);
            formData.append('description', frame.description || '');
            formData.append('is_popular', frame.is_popular);
            formData.append('status', newStatus);

            const response = await fetch(`${API_URL}/frames/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
                fetchAll();
            } else {
                toast.error('Failed to update status', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating status', { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this frame?')) return;

        const loadingToast = toast.loading('Deleting frame...');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/frames/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Frame deleted successfully', { id: loadingToast });
                fetchAll();
            } else {
                toast.error('Failed to delete frame', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting frame', { id: loadingToast });
        }
    };

    const handleSaveFrame = async (e) => {
        e.preventDefault();

        if (!editingId && !imageFile) {
            toast.error('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        if (imageFile) formData.append('image', imageFile);
        else formData.append('image_url', currentImageUrl); // Important for updates without file change

        formData.append('category_id', categoryId);
        formData.append('description', description);
        formData.append('is_popular', isPopular);
        formData.append('status', status);

        const loadingToast = toast.loading(editingId ? 'Updating frame...' : 'Adding frame...');

        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `${API_URL}/frames/${editingId}`
                : `${API_URL}/frames`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                toast.success(editingId ? 'Frame updated successfully' : 'Frame added successfully', { id: loadingToast });
                setIsAddModalOpen(false);
                resetForm();
                fetchAll();
            } else {
                toast.error('Failed to save frame', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving frame', { id: loadingToast });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setImageFile(null);
        setCurrentImageUrl('');
        setCategoryId('');
        setDescription('');
        setIsPopular(false);
        setStatus('active');
    };

    const openEdit = (frame) => {
        setEditingId(frame.id);
        setTitle(frame.title);
        setCurrentImageUrl(frame.image_url);
        setCategoryId(frame.category_id || '');
        setDescription(frame.description || '');
        setIsPopular(frame.is_popular === 1 || frame.is_popular === true || frame.is_popular === 'true'); // Handle different conversions
        setStatus(frame.status || 'active');
        setIsAddModalOpen(true);
    };

    const filteredFrames = frames.filter(frame => {
        const matchesSearch = frame.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || frame.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusTabs = [
        { id: 'all', label: 'All', count: frames.length },
        { id: 'active', label: 'Active (Live)', count: frames.filter(f => f.status === 'active').length },
        { id: 'pending', label: 'Pending', count: frames.filter(f => f.status === 'pending').length },
        { id: 'rejected', label: 'Rejected', count: frames.filter(f => f.status === 'rejected').length },
        { id: 'trash', label: 'Trash', count: frames.filter(f => f.status === 'trash').length },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Frame Management</h1>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search frames..."
                        className="w-full pl-4 pr-4 py-2 rounded-lg border focus:outline-none focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg transition-colors hover:bg-green-700"
                    >
                        <Plus size={18} /> Add Frame
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {statusTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === tab.id
                            ? 'bg-gray-800 text-white'
                            : 'bg-white text-gray-600 border hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${statusFilter === tab.id
                            ? 'bg-white text-gray-800'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Preview</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Stats</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredFrames.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No frames found.</td>
                            </tr>
                        ) : (
                            filteredFrames.map((frame) => (
                                <tr key={frame.id} className="border-b hover:bg-gray-50 last:border-0">
                                    <td className="p-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                                            <img src={frame.image_url} alt="" className="w-full h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">
                                        {frame.title}
                                        {frame.is_popular === 1 && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">Popular</span>}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <span title="Views">👁️ {frame.view_count || 0}</span>
                                            <span title="Downloads/Uses">⬇️ {frame.use_count || 0}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{frame.category_name || '-'}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                                            ${frame.status === 'active' ? 'bg-green-100 text-green-700' :
                                                frame.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    frame.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-500'}
                                        `}>
                                            {frame.status === 'active' && <CheckCircle size={12} />}
                                            {frame.status === 'pending' && <Clock size={12} />}
                                            {frame.status === 'rejected' && <XCircle size={12} />}
                                            {frame.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-1">
                                        {/* Quick Actions based on Status */}
                                        {frame.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusChange(frame.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button onClick={() => handleStatusChange(frame.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        {frame.status === 'rejected' && (
                                            <button onClick={() => handleStatusChange(frame.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Re-Approve">
                                                <RotateCcw size={18} />
                                            </button>
                                        )}

                                        <button onClick={() => openEdit(frame)} className="p-2 text-blue-500 hover:bg-blue-50 rounded" title="Edit"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(frame.id)} className="p-2 text-gray-400 hover:bg-gray-100 rounded" title="Delete"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={editingId ? "Edit Frame" : "Add Frame"}>
                <form onSubmit={handleSaveFrame} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input type="text" className="w-full border rounded p-2" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        {currentImageUrl && <img src={currentImageUrl} alt="Current" className="h-20 mb-2 rounded border" />}
                        <input type="file" accept="image/*" className="w-full border rounded p-2" onChange={e => setImageFile(e.target.files[0])} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select className="w-full border rounded p-2" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            <option value="">Select Category (Optional)</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select className="w-full border rounded p-2" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="active">Active (Live)</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="trash">Trash</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea className="w-full border rounded p-2" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} />
                            <span className="text-sm">Popular Frame?</span>
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-green-700 transition">
                        {editingId ? 'Update Frame' : 'Add Frame'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Frames;
