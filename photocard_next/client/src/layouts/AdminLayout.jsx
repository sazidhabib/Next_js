import { useContext } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed
import {
    LayoutDashboard,
    Users,
    ImageIcon,
    Grid,
    Settings,
    LogOut
} from 'lucide-react'; // Import icons

const AdminLayout = () => {
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Toaster position="top-right" reverseOrder={false} />
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col z-10">
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <span className="text-xl font-bold text-gray-800">📷 <span className="text-primary">Admin</span></span>
                </div>

                <div className="flex-grow p-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/admin' || location.pathname === '/admin/' ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={20} />
                        ড্যাশবোর্ড
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/users') ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Users size={20} />
                        ব্যবহারকারী
                    </Link>
                    <Link
                        to="/admin/frames"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/frames') ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <ImageIcon size={20} />
                        ফ্রেম ম্যানেজমেন্ট
                    </Link>
                    <Link
                        to="/admin/categories"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/categories') ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Grid size={20} />
                        ক্যাটাগরি
                    </Link>
                    <Link
                        to="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname.startsWith('/admin/settings') ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Settings size={20} />
                        সেটিংস
                    </Link>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        লগআউট
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-0">
                    <h2 className="text-lg font-bold text-gray-700">অ্যাডমিন প্যানেল</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span className="text-sm font-medium text-gray-600">{user?.username || 'Admin User'}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;