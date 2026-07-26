import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Video,
    UserCircle,
    LogOut,
    Target,
    Award
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/login';
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'ATS Checker', path: '/ats', icon: FileText },
        { name: 'Mock Interview', path: '/interview', icon: Video },
        { name: 'Score Cards', path: '/scorecards', icon: Award },
        { name: 'Profile', path: '/profile', icon: UserCircle },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 text-slate-900 z-50">
            {/* Logo area */}
            <div className="p-6 flex items-center justify-center border-b border-gray-100">
                <span className="text-[28px] font-black tracking-tight select-none">
                    <span className="text-[#0b1120]">Ace</span>
                    <span className="text-[#4353ff]">The</span>
                    <span className="text-[#0b1120]">Job</span>
                    <span className="text-[#2563eb]">.</span>
                </span>
            </div>

            {/* Navigation Options */}
            <nav className="flex-1 py-6 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg transition-colors group ${isActive
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={20}
                                        className={`mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                                            }`}
                                    />
                                    <span>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                    <LogOut
                        size={20}
                        className="mr-3 text-slate-400 group-hover:text-red-500 transition-colors"
                    />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
