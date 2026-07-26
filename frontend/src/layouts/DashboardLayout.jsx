import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // Check if the current route is exactly the interview session (not the setup or feedback page)
    const isInterviewSession = location.pathname.match(/^\/interview\/[a-fA-F0-9]{24}$/);

    // Protect all routes inside DashboardLayout
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {!isInterviewSession && <Sidebar />}
            <main className={`flex-1 overflow-y-auto ${!isInterviewSession ? 'ml-64' : ''}`}>
                <div className="h-full">
                    {/* The nested routes render here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
