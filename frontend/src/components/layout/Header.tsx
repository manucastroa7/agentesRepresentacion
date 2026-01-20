import { Menu, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-0 w-full z-40 px-4 md:px-8 flex items-center justify-between">
            {/* Left: Mobile Menu Trigger & Branding (Desktop) */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                {/* On mobile, we might want to show logo here if sidebar is hidden */}
                <span className="md:hidden font-display font-bold text-white text-lg tracking-tight">
                    Agent<span className="text-[#39FF14]">Sport</span>
                </span>
            </div>

            {/* Right: User Dropdown */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <div className="flex items-center gap-3 hover:bg-white/5 p-1.5 pl-3 pr-2 rounded-full transition-all border border-transparent hover:border-white/10">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-white leading-none mb-1">
                                    {user?.email?.split('@')[0] || 'Usuario'}
                                </p>
                                <p className="text-xs text-slate-400 capitalize bg-slate-800/50 px-2 py-0.5 rounded-full inline-block">
                                    {user?.role || 'Guest'}
                                </p>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-[#39FF14]/20">
                                <AvatarImage src={user?.avatarUrl} />
                                <AvatarFallback className="bg-slate-800 text-[#39FF14] font-bold">
                                    {(user?.email || 'U').charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10 text-slate-200 z-[100]">
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-white">
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-white">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configuración</span>
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
