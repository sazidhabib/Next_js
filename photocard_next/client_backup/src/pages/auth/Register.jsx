import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Register User
            const response = await fetch(`${API_URL}/users/register`, { // Using public register endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    role: 'user'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // 2. Auto Login after successful registration
            await login(formData.email, formData.password);

            // 3. Redirect to Dashboard
            navigate('/login');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">অ্যাকাউন্ট খুলুন</h2>
                    <p className="text-gray-500">সম্পূর্ণ ফ্রিতে রেজিস্ট্রেশন করুন</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">নাম</label>
                        <div className="relative">
                            <input
                                name="username"
                                type="text"
                                placeholder="আপনার নাম"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ইমেইল</label>
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                placeholder="example@email.com"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Phone field - kept in UI but might not be sent to backend if not in schema. 
                        Assuming schema currently only has username, email, password, role. 
                        If schema has phone, add it to body. I will keep it in state but not send for now to be safe, 
                        unless I verify schema. The snippet shows phone in UI. */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
                        <div className="relative">
                            <input
                                name="phone"
                                type="tel"
                                placeholder="017xxxxxxxx"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                placeholder="********"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'অপেক্ষা করুন...' : 'রেজিস্ট্রেশন করুন'} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        আগেই অ্যাকাউন্ট আছে?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            লগইন করুন
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
