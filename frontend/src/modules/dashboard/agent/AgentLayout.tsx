import { Outlet, NavLink } from 'react-router-dom';
import { Users, Settings, LogOut, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AgentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex text-white font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <h1 className="text-xl font-display font-bold italic">
                        AGENT<span className="text-[#39FF14]">CRM</span>
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    <NavLink
                        to="/dashboard/agent"
                        end
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                            ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Users size={20} />
                        <span className="font-medium">Mi Plantilla</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/agent/requests"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                            ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Bell size={20} />
                        <span className="font-medium">Solicitudes</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/agent/settings"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                            ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Settings size={20} />
                        <span className="font-medium">Configuración</span>
                    </NavLink>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-3">
                        <LogOut size={18} />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header */}
                <header className="h-16 md:hidden flex items-center px-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="text-white" />
                    </Button>
                    <span className="ml-4 font-bold text-white">Agent Dashboard</span>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AgentLayout;
