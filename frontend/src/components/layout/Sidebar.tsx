import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { getNavByRole } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Share2, ExternalLink, Copy } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const navItems = getNavByRole(user?.role);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            {/* Sidebar Content */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-slate-950 border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <span className="font-display font-bold text-white text-xl tracking-tight">
                        Agent<span className="text-[#39FF14]">Sport</span>
                    </span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === '/dashboard'}
                            onClick={() => onClose()} // Close mobile sidebar on click
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-[#39FF14]/10 text-[#39FF14]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {/* Active Indicator Bar */}
                            <span className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#39FF14] transition-all duration-300",
                                // Only show if active, usage of CSS variable or class check would be standard
                                // relying on navlink active class logic above for parent style, 
                                // but inner element needs explicit active check or CSS nesting.
                                // React Router's active logic is best handled with CSS modules or just conditional rendering here.
                                "opacity-0 scale-y-0 origin-left group-[.active]:opacity-100 group-[.active]:scale-y-100"
                            )} />

                            <item.icon size={20} className="shrink-0" />
                            <span className="font-medium text-sm">{item.title}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Share Agency Section (Agent Only) */}
                {user?.role === 'agent' && (
                    <div className="px-6 py-4 border-t border-white/5">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Share2 size={12} /> Compartir Agencia
                        </h3>
                        <div className="space-y-1">
                            <a
                                href={`/u/${user?.agentSlug || user?.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-400 hover:text-[#39FF14] text-sm py-1 transition-colors"
                            >
                                <ExternalLink size={14} /> Ver mi sitio público
                            </a>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/u/${user?.agentSlug || user?.id}`);
                                    // You might want to add a toast here, but Sidebar doesn't have toast setup.
                                }}
                                className="flex items-center gap-2 text-slate-400 hover:text-[#39FF14] text-sm py-1 transition-colors w-full text-left"
                            >
                                <Copy size={14} /> Copiar enlace
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer / Profile */}
                <div className="p-4 border-t border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#39FF14] font-bold border border-white/10 overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400">Hola,</p>
                            <p className="text-sm font-bold text-white truncate">
                                {user?.agencyName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name) || 'Usuario'}
                            </p>
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
