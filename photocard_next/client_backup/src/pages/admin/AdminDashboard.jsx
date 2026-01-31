import React from 'react';
import { Users, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    // Mock Stats
    const stats = [
        { title: 'মোট ব্যবহারকারী', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'মোট ফ্রেম', value: '56', icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'পেন্ডিং রিকোয়েস্ট', value: '12', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        { title: 'অ্যাক্টিভ ফ্রেম', value: '44', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড ওভারভিউ</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table (Placeholder) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">সাম্প্রতিক ফ্রেম রিকোয়েস্ট</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">ব্যবহারকারী</th>
                                <th className="p-4 font-semibold">ফ্রেমের নাম</th>
                                <th className="p-4 font-semibold">তারিখ</th>
                                <th className="p-4 font-semibold">স্ট্যাটাস</th>
                                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3].map((item) => (
                                <tr key={item} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-gray-800">User {item}</td>
                                    <td className="p-4 text-sm text-gray-600">বিজয় দিবস ফ্রেম {item}</td>
                                    <td className="p-4 text-sm text-gray-500">12 Jan 2026</td>
                                    <td className="p-4">
                                        <span className="inline-block px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                                            পেন্ডিং
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-600 hover:underline text-sm font-medium">বিস্তারিত</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
