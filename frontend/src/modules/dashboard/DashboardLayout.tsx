import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuthStore } from '@/context/authStore';
import { useAgentTheme } from '@/hooks/useAgentTheme';

const DashboardLayout = () => {
    const { user } = useAuthStore();
    useAgentTheme(user?.agent?.branding?.primaryColor);

    return (
        <div className="flex min-h-screen bg-slate-950 text-white selection:bg-neon-green selection:text-slate-950">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <Sidebar />

            <div className="relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
