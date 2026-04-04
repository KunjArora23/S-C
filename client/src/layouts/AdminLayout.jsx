import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { admin, logout } = useAuth();

    const menuItems = [
        {
            name: 'Dashboard',
            icon: '📊',
            path: '/admin/dashboard',
        },
        {
            name: 'Cities',
            icon: '🏙️',
            path: '/admin/cities',
        },
        {
            name: 'Tours',
            icon: '✈️',
            path: '/admin/tours',
        },
        {
            name: 'Reviews',
            icon: '💬',
            path: '/admin/reviews',
        },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    const handleNavigate = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden">
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <div
                className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed inset-y-0 left-0 z-40 w-64 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'
                    } bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col overflow-hidden`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                S&C
                            </div>
                            <span className="font-bold text-white">Tours</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white hidden lg:block"
                    >
                        {sidebarOpen ? '←' : '→'}
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                {/* Menu items */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                    ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                }`}
                            title={!sidebarOpen ? item.name : ''}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {(sidebarOpen || mobileMenuOpen) && <span className="font-medium">{item.name}</span>}
                        </button>
                    ))}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-slate-700 space-y-3">
                    {(sidebarOpen || mobileMenuOpen) && (
                        <div className="px-2 py-2 bg-slate-700/30 rounded-lg">
                            <p className="text-xs text-slate-400">Logged in as</p>
                            <p className="text-sm font-medium text-white truncate">{admin?.name || admin?.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-200"
                        title="Logout"
                    >
                        <span>🚪</span>
                        {(sidebarOpen || mobileMenuOpen) && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 rounded-lg border border-slate-700 text-slate-300 lg:hidden"
                            aria-label="Open navigation"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">S&C Tours Admin</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-slate-400">Welcome back</p>
                            <p className="font-semibold text-white truncate max-w-44">{admin?.name || admin?.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {(admin?.name || admin?.email)?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-auto bg-slate-900">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;


