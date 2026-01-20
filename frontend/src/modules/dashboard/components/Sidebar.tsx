import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { Users, Search, Settings, LogOut, Menu, X, Plus, Share2, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE_URL } from '@/config/api';

const Sidebar = () => {
    const { logout, user, token, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/agents/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    const agentData = result.data || result;
                    updateUser({
                        agentSlug: agentData.slug,
                        agencyName: agentData.agencyName
                    });
                }
            } catch (error) {
                console.error('Error fetching agent data:', error);
            }
        };

        if (token && user?.role === 'agent') {
            fetchAgentData();
        }
    }, [token, user?.role, updateUser]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        if (user?.role === 'player') {
            return [
                { path: '/dashboard/find-agent', icon: Search, label: 'Buscar Agente', implemented: true },
                { path: '/dashboard/my-applications', icon: Users, label: 'Mis Solicitudes', implemented: false },
                { path: '/dashboard/profile', icon: Users, label: 'Mi Perfil', implemented: true },
            ];
        } else if (user?.role === 'agent' || user?.role === 'superadmin') {
            return [
                { path: '/dashboard', icon: Users, label: 'Inicio', implemented: true },
                { path: '/dashboard/applications', icon: Users, label: 'Solicitudes', implemented: true },
                { path: '/dashboard/players', icon: Users, label: 'Mi Plantel', implemented: true },
                { path: '/dashboard/scouting', icon: Search, label: 'Scouting', implemented: true },
                { path: '/dashboard/settings', icon: Settings, label: 'Configuracion', implemented: true },
            ];
        }
        return [];
    };

    const navItems = getNavItems();

    const handleNavClick = (e: React.MouseEvent, item: any) => {
        if (!item.implemented) {
            e.preventDefault();
            toast({
                title: "Proximamente",
                description: `El modulo de ${item.label} estara disponible en futuras actualizaciones.`,
                className: "bg-slate-900 border-white/10 text-white",
            });
        }
        setIsMobileMenuOpen(false);
    };

    const handleViewPublicPortfolio = () => {
        if (user?.agentSlug) {
            window.open(`/u/${user.agentSlug}`, '_blank');
        }
    };

    const handleCopyPortfolioLink = () => {
        if (user?.agentSlug) {
            const url = `${window.location.origin}/u/${user.agentSlug}`;
            navigator.clipboard.writeText(url);
            toast({
                title: "Enlace copiado",
                description: "El enlace de tu portafolio ha sido copiado al portapapeles.",
                variant: "success",
            });
        }
    };

    return (
        <>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg border border-white/10 shadow-lg hover:bg-slate-800 transition-colors"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`
                fixed md:sticky top-0 left-0 z-40 h-screen w-72
                bg-slate-900 border-r border-white/5
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8 border-b border-white/5">
                    <h1 className="font-display font-bold text-2xl text-white tracking-wider flex items-center gap-2">
                        AGENT SPORT
                    </h1>
                </div>

                <div className="px-6 py-6">
                    {user?.role === 'agent' && (
                        <button
                            onClick={() => {
                                navigate('/dashboard/players/new');
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3.5 bg-[#39FF14] text-slate-950 font-bold rounded-lg hover:bg-[#32d912] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm transform active:scale-95"
                        >
                            <Plus size={20} />
                            Nuevo Jugador
                        </button>
                    )}
                </div>

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

                {user?.role === 'agent' && user?.agentSlug && (
                    <div className="px-6 py-4 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Share2 size={16} className="text-[#39FF14]" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Compartir Agencia
                            </p>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={handleViewPublicPortfolio}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <ExternalLink size={16} />
                                <span>Ver mi sitio publico</span>
                            </button>
                            <button
                                onClick={handleCopyPortfolioLink}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <Copy size={16} />
                                <span>Copiar enlace</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-6 border-t border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#39FF14] font-bold border border-white/10 shadow-inner">
                            {user?.agencyName?.charAt(0) || user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-slate-400 truncate">Hola,</p>
                            <p className="text-sm font-bold text-white truncate">{user?.agencyName || user?.name || 'Usuario'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm w-full px-1"
                    >
                        <LogOut size={16} />
                        <span>Cerrar Sesion</span>
                    </button>
                </div>
            </aside>

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
