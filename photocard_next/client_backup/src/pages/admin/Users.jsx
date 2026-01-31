import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Trash2, Plus, UserPlus, Edit2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { API_URL } from '../../config';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        const loadingToast = toast.loading('Deleting user...');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('User deleted successfully', { id: loadingToast });
                setUsers(users.filter(user => user.id !== id));
            } else {
                toast.error('Failed to delete user', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting user', { id: loadingToast });
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? 'Updating user...' : 'Adding user...');
        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `${API_URL}/users/${editingId}`
                : `${API_URL}/users`;

            const method = editingId ? 'PUT' : 'POST';

            const bodyData = { username, email, role };
            if (password) bodyData.password = password; // Only send password if provided

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                toast.success(editingId ? 'User updated successfully' : 'User added successfully', { id: loadingToast });
                setIsModalOpen(false);
                resetForm();
                fetchUsers();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to save user', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving user', { id: loadingToast });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('user');
    };

    const openEdit = (user) => {
        setEditingId(user.id);
        setUsername(user.username);
        setEmail(user.email);
        setPassword(''); // Don't fill password
        setRole(user.role);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">ব্যবহারকারী ব্যবস্থাপনা</h1>
                <div className="flex gap-3">
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        <Plus size={18} /> অ্যাড ইউজার
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">নাম</th>
                                <th className="p-4 font-semibold">ইমেইল</th>
                                <th className="p-4 font-semibold">মোবাইল</th>
                                <th className="p-4 font-semibold">জয়েনিং তারিখ</th>
                                <th className="p-4 font-semibold">রোল</th>
                                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">লোডিং...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">কোনো ব্যবহারকারী পাওয়া যায়নি</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{user.username}</td>
                                        <td className="p-4 text-sm text-gray-800">{user.email}</td>
                                        <td className="p-4 text-sm text-gray-800">{user.phone_number || '-'}</td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => openEdit(user)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded">
                                                <Edit2 size={16} />
                                            </button>
                                            {user.role !== 'admin' && (
                                                <button onClick={() => handleDelete(user.id)} className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit User" : "Add New User"}
            >
                <form onSubmit={handleSaveUser} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">নাম</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ইমেইল</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">পাসওয়ার্ড {editingId ? '(Leave blank to keep same)' : ''}</label>
                        <input
                            type="password"
                            required={!editingId}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">রোল</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        <UserPlus size={18} />
                        {editingId ? 'Update User' : 'Add User'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
