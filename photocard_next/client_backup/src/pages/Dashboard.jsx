import React, { useState, useEffect, useContext } from 'react';
import {
    Mail, Edit, LogOut, Phone,
    Image as ImageIcon, CheckCircle, Clock,
    List, Headphones, MessageCircle, Trash2, Edit2, Download, Eye, XCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('live');
    const [stats, setStats] = useState({
        total: 0,
        live: 0,
        pending: 0,
        rejected: 0,
        trash: 0
    });
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch Stats
                const statsRes = await fetch(`${API_URL}/frames/stats`, { headers });
                const statsData = await statsRes.json();
                if (statsRes.ok) setStats(statsData);

                // Fetch Frames
                const framesRes = await fetch(`${API_URL}/frames/my-frames`, { headers });
                const framesData = await framesRes.json();
                if (framesRes.ok) setFrames(framesData);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('ডেটা লোড করতে সমস্যা হয়েছে');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Filter frames based on active tab
    const filteredFrames = frames.filter(frame => {
        if (activeTab === 'live') return frame.status === 'active';
        if (activeTab === 'pending') return frame.status === 'pending'; // New default status
        if (activeTab === 'rejected') return frame.status === 'rejected';
        if (activeTab === 'trash') return frame.status === 'trash';
        return false;
    });

    const handleDelete = async (id) => {
        if (!window.confirm('আপনি কি নিশ্চিত এই ফ্রেমটি ডিলিট করতে চান?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/frames/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('ফ্রেম ডিলিট করা হয়েছে');
                // Remove from state
                setFrames(frames.filter(frame => frame.id !== id));
                // Update stats locally (simple decrement) - ideal would be refetch
                setStats(prev => ({ ...prev, total: prev.total - 1 }));
            } else {
                toast.error('ডিলিট ব্যর্থ হয়েছে');
            }
        } catch (error) {
            console.error(error);
            toast.error('সার্ভার সমস্যা');
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">লোড হচ্ছে...</div>;

    const tabs = [
        { id: 'live', label: 'লাইভ', icon: <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>, count: stats.live },
        { id: 'pending', label: 'পেন্ডিং', icon: <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>, count: stats.pending },
        { id: 'rejected', label: 'রিজেক্ট', icon: <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>, count: stats.rejected },
        { id: 'trash', label: 'ট্র্যাশ', icon: <Trash2 size={14} className="text-gray-400" />, count: stats.trash },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-4 space-y-8 max-w-7xl">

                {/* 1. User Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full border-4 border-green-50 bg-green-100 flex items-center justify-center text-green-600 font-bold text-3xl">
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="text-center md:text-left space-y-1">
                            <h2 className="text-2xl font-bold text-gray-800">{user?.username || 'Guest'}</h2>
                            <div className="flex items-center gap-2 text-gray-500 text-sm justify-center md:justify-start">
                                <Mail size={14} />
                                {user?.email || 'No Email Provided'}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm justify-center md:justify-start">
                                <Phone size={14} />
                                {user?.phone_number || 'No Phone Number Provided'}
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Edit Profile Button could go here */}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors">
                            <LogOut size={16} />
                            লগআউট
                        </button>
                    </div>
                </div>

                {/* 1.a Stats Cards (New Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Frames */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
                            <p className="text-sm text-gray-500 font-medium">মোট ফ্রেম</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <ImageIcon size={20} />
                        </div>
                    </div>

                    {/* Live Frames */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{stats.live}</h3>
                            <p className="text-sm text-gray-500 font-medium">লাইভ ফ্রেম</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle size={20} />
                        </div>
                    </div>

                    {/* Pending Frames */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{stats.pending}</h3>
                            <p className="text-sm text-gray-500 font-medium">পেন্ডিং</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                    </div>

                    {/* Total Views (Placeholder for now) */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">0</h3>
                            <p className="text-sm text-gray-500 font-medium">মোট ভিউ</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                            <Eye size={20} />
                        </div>
                    </div>
                </div>

                {/* 1.b Help Banner */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <Headphones size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">অ্যাডমিনের সহায়তা প্রয়োজন?</h3>
                            <p className="text-sm text-gray-500 mt-1">ফ্রেমে সমস্যা বা অ্যাকাউন্টে কোনো জটিলতা দেখা দিলে আমাদের সাথে সরাসরি যোগাযোগ করুন। আমরা দ্রুত সমাধানের চেষ্টা করব।</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-green-700 transition-colors">
                            <MessageCircle size={18} /> হোয়াটসঅ্যাপ
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors">
                            লাইভ চ্যাট
                        </button>
                    </div>
                </div>

                {/* 2. My Frame Collection Header + Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="text-green-600" size={24} />
                        <h3 className="text-xl font-bold text-gray-800">আমার ফটো ফ্রেম কালেকশন</h3>
                    </div>

                    <div className="flex items-center bg-white p-1.5 rounded-full shadow-sm border border-gray-100 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-green-700 text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50'}
                                `}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">ছবি</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">বিস্তারিত</th>
                                    <th className="text-center py-4 px-6 text-sm font-medium text-gray-500">স্ট্যাটাস</th>
                                    <th className="text-center py-4 px-6 text-sm font-medium text-gray-500">ভিউ</th>
                                    <th className="text-center py-4 px-6 text-sm font-medium text-gray-500">ডাউনলোড</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFrames.length > 0 ? (
                                    filteredFrames.map(frame => (
                                        <tr key={frame.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0">
                                            <td className="py-4 px-6 w-24">
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                    <img src={frame.image_url} alt={frame.title} className="w-full h-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <h4 className="font-bold text-gray-800 mb-1">{frame.title}</h4>
                                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">
                                                    {frame.category_name || 'No Category'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                                                    ${frame.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        frame.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                            frame.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-500'}
                                                `}>
                                                    {frame.status === 'active' && <CheckCircle size={12} />}
                                                    {frame.status === 'pending' && <Clock size={12} />}
                                                    {frame.status === 'rejected' && <XCircle size={12} />}
                                                    {frame.status === 'trash' && <Trash2 size={12} />}
                                                    {frame.status === 'active' ? 'লাইভ' :
                                                        frame.status === 'pending' ? 'পেন্ডিং' :
                                                            frame.status === 'rejected' ? 'রিজেক্ট' : 'ট্র্যাশ'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600 font-medium">
                                                {/* Placeholder for Views */}
                                                {frame.view_count || 0}
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600 font-medium">
                                                {/* Placeholder for Downloads */}
                                                {frame.use_count || 0}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                        <Edit2 size={16} />
                                                    </button> */}
                                                    <button
                                                        onClick={() => handleDelete(frame.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-gray-400">
                                            কোনো তথ্য পাওয়া যায়নি
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
