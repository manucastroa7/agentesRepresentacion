import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { Users, Search, Settings, LogOut, Menu, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Sidebar = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard/players', icon: Users, label: 'Mi Plantel', implemented: true },
        { path: '/dashboard/scouting', icon: Search, label: 'Scouting', implemented: false },
        { path: '/dashboard/settings', icon: Settings, label: 'Configuración', implemented: false },
    ];

    const handleNavClick = (e: React.MouseEvent, item: any) => {
        if (!item.implemented) {
            e.preventDefault();
            toast({
                title: "Próximamente",
                description: `El módulo de ${item.label} estará disponible en futuras actualizaciones.`,
                className: "bg-slate-900 border-white/10 text-white",
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg border border-white/10 shadow-lg hover:bg-slate-800 transition-colors"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-40 h-screen w-72
                bg-slate-900 border-r border-white/5
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-8 border-b border-white/5">
                    <h1 className="font-display font-bold text-2xl text-white tracking-wider flex items-center gap-2">
                        AGENT SPORT
                    </h1>
                </div>

                {/* CTA Button */}
                <div className="px-6 py-6">
                    <button
                        onClick={() => {
                            navigate('/dashboard/players/new'); // 👈 Esta es la magia que faltaba
                            setIsMobileMenuOpen(false); // Cerramos el menú si estamos en móvil
                        }}
                        className="w-full py-3.5 bg-[#39FF14] text-slate-950 font-bold rounded-lg hover:bg-[#32d912] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm transform active:scale-95"
                    >
                        <Plus size={20} />
                        Nuevo Jugador
                    </button>
                </div>      

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={(e) => handleNavClick(e, item)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 group
                                ${isActive && item.implemented
                                    ? 'text-[#39FF14] bg-white/5 border-r-2 border-[#39FF14]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive && item.implemented ? 'text-[#39FF14]' : 'text-slate-500 group-hover:text-white transition-colors'} />
                                    <span className="font-medium tracking-wide">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#39FF14] font-bold border border-white/10 shadow-inner">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Agente'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@agentsport.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm w-full px-1"
                    >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
