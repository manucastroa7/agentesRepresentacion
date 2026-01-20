import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#39FF14] selection:text-black">
            {/* Sidebar (Fixed Left) */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            {/* 'md:pl-64' pushes content to right of fixed sidebar on desktop */}
            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">

                {/* Header (Fixed Top) */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                {/* 'pt-16' ensures content starts below fixed header */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
