import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Plus, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { settings } = useSettings();

    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Hide Navbar on Admin Routes
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    // Dashboard Navbar
    if (location.pathname === '/dashboard') {
        return (
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto" />
                        ) : (
                            <span className="text-xl font-bold text-green-700 flex items-center gap-2">
                                <span className="text-2xl">📷</span> {settings.site_name}
                            </span>
                        )}
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center gap-6">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                        </button>
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium">
                            হোম
                        </Link>
                        <Link to="/add-frame" className="flex items-center gap-2 bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition-colors shadow-lg shadow-green-200">
                            <Plus size={18} />
                            ফ্রেম যুক্ত করুন
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto" />
                        ) : (
                            <>
                                <div className="w-8 h-8 bg-primary rounded lg:hidden"></div>
                                <span className="text-xl font-bold text-green-700 flex items-center gap-2">
                                    <span className="text-2xl">📷</span> {settings.site_name}
                                </span>
                            </>
                        )}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium">হোম</Link>
                        <Link to="/popular-frames" className="text-gray-600 hover:text-primary font-medium">জনপ্রিয় ফ্রেম</Link>
                        <Link to="/text-frames" className="text-gray-600 hover:text-primary font-medium">টেক্সট ফ্রেম</Link>
                        <Link to="/all-frames" className="text-gray-600 hover:text-primary font-medium">সকল ফ্রেম</Link>
                        <Link to="/add-frame" className="text-gray-600 hover:text-primary font-medium">যুক্ত করুন</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-primary font-medium">যোগাযোগ</Link>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4 ml-4">
                            {!user || user.role === 'admin' ? (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold transition-colors shadow-lg shadow-blue-200"
                                >
                                    <User size={18} />
                                    লগইন
                                </Link>
                            ) : (
                                <>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                                        <Bell size={20} />
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                                    </button>
                                    <Link to="/add-frame" className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md shadow-blue-100">
                                        <Plus size={18} />
                                        যুক্ত করুন
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Link to="/dashboard" className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full font-medium border border-green-200 hover:bg-green-100">
                                            <User size={18} />
                                            {user.username || 'User'}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="লগআউট"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50">হোম</Link>
                        <Link to="/popular-frames" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50">জনপ্রিয় ফ্রেম</Link>
                        <Link to="/text-frames" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50">টেক্সট ফ্রেম</Link>
                        <Link to="/all-frames" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50">সকল ফ্রেম</Link>

                        {!user || user.role === 'admin' ? (
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-green-50 mt-4">
                                লগইন
                            </Link>
                        ) : (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50">
                                    ড্যাশবোর্ড ({user.username})
                                </Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                    লগআউট
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
