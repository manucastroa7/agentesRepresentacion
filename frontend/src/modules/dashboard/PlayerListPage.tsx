import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Link as LinkIcon, MapPin, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/context/authStore';
import { useToast } from "@/hooks/use-toast";

const PlayerListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [players, setPlayers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { token } = useAuthStore();
    const { toast } = useToast();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('http://localhost:3000/players', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    // Handle backend response wrapper { statusCode, data }
                    const playersData = result.data || result;
                    setPlayers(Array.isArray(playersData) ? playersData : []);
                } else {
                    console.error("Error fetching players");
                }
            } catch (error) {
                console.error("Network error fetching players", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchPlayers();
        }
    }, [token]);

    const filteredPlayers = players.filter(player =>
        player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                            Plantel Actual
                        </h2>
                        <p className="text-slate-400 mt-1 font-light">
                            Gestiona los perfiles y accesos de tus jugadores.
                        </p>
                    </div>
                </div>

                {/* Search Bar and View Toggle */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-[#39FF14] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar jugador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]/50 focus:ring-1 focus:ring-[#39FF14]/50 transition-all backdrop-blur-sm"
                        />
                    </div>

                    {/* View Toggle Buttons */}
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-xl p-1 backdrop-blur-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${viewMode === 'grid'
                                ? 'bg-[#39FF14] text-slate-950 shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            title="Vista de cuadrícula"
                        >
                            <LayoutGrid size={18} />
                            <span className="hidden sm:inline">Cuadrícula</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${viewMode === 'list'
                                ? 'bg-[#39FF14] text-slate-950 shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            title="Vista de lista"
                        >
                            <List size={18} />
                            <span className="hidden sm:inline">Lista</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Players Display */}
            {isLoading ? (
                <div className="text-center text-white">Cargando jugadores...</div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlayers.map((player, index) => (
                        <motion.div
                            key={player.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-[#39FF14]/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all duration-300 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={player.avatarUrl || 'https://via.placeholder.com/400'}
                                    alt={`${player.firstName} ${player.lastName}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                                {/* Floating Info */}
                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                    <span className="text-xs font-bold text-white">
                                        {new Date().getFullYear() - new Date(player.birthDate).getFullYear()} AÑOS
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <p className="text-[#39FF14] text-xs font-bold tracking-wider uppercase mb-1">
                                        {player.position}
                                    </p>
                                    <h3 className="text-xl font-display font-bold text-white leading-tight">
                                        {player.firstName} {player.lastName}
                                    </h3>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                                        <MapPin size={12} />
                                        <span>{player.nationality}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-2">
                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/p/${player.id}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#39FF14]/10 hover:bg-[#39FF14] text-[#39FF14] hover:text-slate-950 rounded-lg transition-all duration-300 text-sm font-bold group/btn"
                                >
                                    <LinkIcon size={16} />
                                    <span className="hidden sm:inline">Link Público</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => window.location.href = `/dashboard/players/edit/${player.id}`}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('¿Estás seguro de eliminar este jugador? Esta acción no se puede deshacer.')) {
                                                try {
                                                    const response = await fetch(`http://localhost:3000/players/${player.id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`
                                                        }
                                                    });
                                                    if (response.ok) {
                                                        setPlayers(players.filter(p => p.id !== player.id));
                                                        toast({
                                                            title: "Jugador eliminado",
                                                            description: "El jugador ha sido eliminado correctamente.",
                                                            variant: "success",
                                                        });
                                                    } else {
                                                        toast({
                                                            title: "Error",
                                                            description: "No se pudo eliminar el jugador.",
                                                            variant: "destructive",
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error('Error deleting player:', error);
                                                    toast({
                                                        title: "Error",
                                                        description: "Ocurrió un error al eliminar el jugador.",
                                                        variant: "destructive",
                                                    });
                                                }
                                            }
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-3">
                    {filteredPlayers.map((player, index) => (
                        <motion.div
                            key={player.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden hover:border-[#39FF14]/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 p-4">
                                {/* Avatar */}
                                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-[#39FF14]/30 transition-all">
                                    <img
                                        src={player.avatarUrl || 'https://via.placeholder.com/400'}
                                        alt={`${player.firstName} ${player.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Player Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3 flex-wrap">
                                        <div className="flex-1 min-w-[200px]">
                                            <h3 className="text-lg font-display font-bold text-white leading-tight">
                                                {player.firstName} {player.lastName}
                                            </h3>
                                            <p className="text-[#39FF14] text-xs font-bold tracking-wider uppercase mt-0.5">
                                                {player.position}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <MapPin size={14} />
                                                <span>{player.nationality}</span>
                                            </div>
                                            <div className="bg-slate-800/50 px-3 py-1 rounded-md border border-white/10">
                                                <span className="text-xs font-bold text-white">
                                                    {new Date().getFullYear() - new Date(player.birthDate).getFullYear()} años
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/p/${player.id}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="flex items-center gap-2 py-2 px-3 bg-[#39FF14]/10 hover:bg-[#39FF14] text-[#39FF14] hover:text-slate-950 rounded-lg transition-all duration-300 text-sm font-bold"
                                        title="Abrir perfil público"
                                    >
                                        <LinkIcon size={16} />
                                        <span className="hidden lg:inline">Ver</span>
                                    </button>
                                    <button
                                        onClick={() => window.location.href = `/dashboard/players/edit/${player.id}`}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('¿Estás seguro de eliminar este jugador? Esta acción no se puede deshacer.')) {
                                                try {
                                                    const response = await fetch(`http://localhost:3000/players/${player.id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`
                                                        }
                                                    });
                                                    if (response.ok) {
                                                        setPlayers(players.filter(p => p.id !== player.id));
                                                        toast({
                                                            title: "Jugador eliminado",
                                                            description: "El jugador ha sido eliminado correctamente.",
                                                            variant: "success",
                                                        });
                                                    } else {
                                                        toast({
                                                            title: "Error",
                                                            description: "No se pudo eliminar el jugador.",
                                                            variant: "destructive",
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error('Error deleting player:', error);
                                                    toast({
                                                        title: "Error",
                                                        description: "Ocurrió un error al eliminar el jugador.",
                                                        variant: "destructive",
                                                    });
                                                }
                                            }
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!isLoading && filteredPlayers.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                        <Search className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No se encontraron jugadores</h3>
                    <p className="text-slate-400">Intenta con otros términos de búsqueda o crea uno nuevo.</p>
                </div>
            )}
        </div>
    );
};

export default PlayerListPage;
