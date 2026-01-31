import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            // Check if admin? The login function just logs in. Protected Route handles redirection if not admin.
            // But good to check if role is admin here to provide better feedback.
            // For now, let's assume if login works and it's from admin page, and protected route checks it, it's fine.
            // However, the `login` result only says success.
            // The AuthContext sets the user.
            // We can check local storage or similar, but the navigation will trigger ProtectedRoute logic.
            // Actually, if a normal user logs in here, they will be redirected to /admin, and ProtectedRoute will kick them out to / (home).
            // That flow is acceptable.
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">অ্যাডমিন লগইন</h2>
                    <p className="text-gray-500 text-sm">নিরাপত্তার স্বার্থে আপনার পরিচয় নিশ্চিত করুন</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">অ্যাডমিন ইমেইল</label>
                        <input
                            type="email"
                            placeholder="admin@photocard.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="********"
                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <button className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        লগইন <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
