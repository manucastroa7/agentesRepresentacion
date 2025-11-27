import { useAuthStore } from '@/context/authStore';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar jugadores, contratos..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-slate-500 hover:text-primary transition-colors p-2 hover:bg-slate-100 rounded-full">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
