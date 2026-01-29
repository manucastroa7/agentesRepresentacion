import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { Plus, Search, Share2, Edit2, Globe, Trash2, LayoutGrid, List, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import defaultAvatar from '@/assets/default_avatar.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import PlayerPreviewModal from '../components/PlayerPreviewModal';

interface Player {
    id: string;
    firstName: string;
    lastName: string;
    position: string | string[];
    nationality: string;
    contractStatus: string; // 'Libre', 'Con Contrato'
    isMarketplaceVisible: boolean;
    avatarUrl?: string;
    birthDate?: string;
    height?: number;
    weight?: number;
    foot?: string;
    club?: string;
    videoUrl?: string;
    marketValue?: string;
    tacticalPoints?: any[];
}

const MySquadPage = () => {
    const { user } = useAuthStore();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [agentSlug, setAgentSlug] = useState<string | null>(user?.agentSlug || null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; itemId: string | null; itemName: string }>({ show: false, itemId: null, itemName: '' });
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [previewPlayer, setPreviewPlayer] = useState<Player | null>(null);

    useEffect(() => {
        fetchPlayers();
        if (!user?.agentSlug) {
            fetchAgentProfile();
        }
    }, [user?.agentSlug]);

    const fetchAgentProfile = async () => {
        try {
            const response = await api.get('/agents/profile');
            const data = response.data.data || response.data;
            setAgentSlug(data.slug);
        } catch (error) {
            console.error('Error fetching agent profile:', error);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await api.get('/players');
            // Handle backend response wrapper { statusCode, data }
            const playersData = response.data.data || response.data;
            setPlayers(Array.isArray(playersData) ? playersData : []);
        } catch (error) {
            console.error('Error fetching players:', error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los jugadores.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, isMarketplaceVisible: !currentStatus } : p));

        try {
            await api.patch(`/agents/players/${id}/visibility`);
            toast({
                title: currentStatus ? "Oculto del Portfolio" : "Visible en Portfolio",
                description: `El jugador ahora es ${!currentStatus ? 'visible' : 'privado'}.`,
                className: "bg-slate-900 text-white border-slate-700"
            });
        } catch (error) {
            // Revert on error
            setPlayers(prev => prev.map(p => p.id === id ? { ...p, isMarketplaceVisible: currentStatus } : p));
            toast({
                title: "Error",
                description: "No se pudo actualizar la visibilidad.",
                variant: "destructive"
            });
        }
    };

    const handleShare = async (id: string, firstName: string, lastName: string) => {
        const url = `${window.location.origin}/p/${id}`;
        const shareData = {
            title: `Perfil de ${firstName} ${lastName}`,
            text: `Mira el perfil de ${firstName} ${lastName}`,
            url: url
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
        } catch (err) {
            console.log('Error using Web Share API:', err);
        }

        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(url);
            toast({
                title: "Enlace Copiado",
                description: "El link del perfil ha sido copiado al portapapeles.",
                className: "bg-[#39FF14] text-black border-none"
            });
        } catch (err) {
            // Legacy fallback
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                toast({
                    title: "Enlace Copiado",
                    description: "El link del perfil ha sido copiado al portapapeles.",
                    className: "bg-[#39FF14] text-black border-none"
                });
            } catch (legacyErr) {
                toast({
                    title: "Error al compartir",
                    description: "No se pudo compartir ni copiar el enlace.",
                    variant: "destructive"
                });
            }
            document.body.removeChild(textArea);
        }
    };

    const copyAgencyLink = () => {
        if (!agentSlug) return;
        const url = `${window.location.origin}/u/${agentSlug}`;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "Enlace de Agencia Copiado",
                description: "El link de tu portafolio público ha sido copiado.",
                className: "bg-[#39FF14] text-black border-none"
            });
        }).catch(() => {
            toast({
                title: "Error",
                description: "No se pudo copiar el enlace.",
                variant: "destructive"
            });
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/players/${id}`);
            setPlayers(prev => prev.filter(p => p.id !== id));
            setDeleteConfirm({ show: false, itemId: null, itemName: '' });
            toast({
                title: "Jugador Eliminado",
                description: "El jugador ha sido eliminado correctamente.",
                className: "bg-red-500 text-white border-none"
            });
        } catch (error) {
            console.error('Error deleting player:', error);
            toast({
                title: "Error",
                description: "No se pudo eliminar el jugador.",
                variant: "destructive"
            });
        }
    };

    const filteredPlayers = players.filter(p =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculateAge = (dateString?: string) => {
        if (!dateString) return '-';
        const ageDifMs = Date.now() - new Date(dateString).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white">Mi Plantilla</h2>
                    <p className="text-slate-400">Gestiona tu cartera de talentos y su visibilidad en tu portfolio.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex gap-1 mr-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                    <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
                        onClick={copyAgencyLink}
                        disabled={!agentSlug}
                    >
                        <Globe size={20} /> Compartir Plantilla
                    </Button>
                    <Button
                        className="bg-[#39FF14] hover:bg-[#32d612] text-black font-bold gap-2"
                        onClick={() => navigate('/dashboard/players/new')}
                    >
                        <Plus size={20} /> Agregar Jugador
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center bg-slate-900 p-2 rounded-xl border border-slate-800 w-full md:w-96">
                <Search className="text-slate-400 ml-2" size={20} />
                <Input
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-slate-500"
                />
            </div>

            {/* Data Content */}
            {viewMode === 'list' ? (
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-slate-200 uppercase font-bold tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">Jugador</th>
                                    <th className="px-6 py-4">Posición</th>
                                    <th className="px-6 py-4">Edad</th>
                                    <th className="px-6 py-4">Nacionalidad</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-center">Portfolio</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">Cargando jugadores...</td>
                                    </tr>
                                ) : filteredPlayers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            No se encontraron jugadores. ¡Agrega uno nuevo!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPlayers.map((player) => (
                                        <tr key={player.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                                                        <img
                                                            src={player.avatarUrl || defaultAvatar}
                                                            alt={player.firstName}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{player.firstName} {player.lastName}</div>
                                                        <div className="text-xs text-slate-500 truncate max-w-[100px]">{player.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-300 capitalize">
                                                {Array.isArray(player.position) ? player.position.join(', ') : player.position}
                                            </td>
                                            <td className="px-6 py-4">{calculateAge(player.birthDate)} años</td>
                                            <td className="px-6 py-4">{player.nationality || '-'}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`${player.contractStatus === 'Libre'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {player.contractStatus}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Switch
                                                        checked={player.isMarketplaceVisible}
                                                        onCheckedChange={() => toggleVisibility(player.id, player.isMarketplaceVisible)}
                                                        className="data-[state=checked]:bg-[#39FF14]"
                                                    />
                                                    <span className="text-xs w-12 text-left">
                                                        {player.isMarketplaceVisible ? 'Visible' : 'Oculto'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                                                        onClick={() => setPreviewPlayer(player)}
                                                        title="Vista Previa"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-[#39FF14] hover:bg-slate-800"
                                                        onClick={() => handleShare(player.id, player.firstName, player.lastName)}
                                                        title="Compartir Perfil"
                                                    >
                                                        <Share2 size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                                                        onClick={() => navigate(`/dashboard/players/edit/${player.id}`)}
                                                        title="Editar Jugador"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                                        onClick={() => setDeleteConfirm({ show: true, itemId: player.id, itemName: `${player.firstName} ${player.lastName}` })}
                                                        title="Eliminar Jugador"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlayers.map((player) => (
                        <div key={player.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-all group relative">
                            <div className="h-48 bg-slate-800 relative">
                                <img
                                    src={player.avatarUrl || defaultAvatar}
                                    alt={player.firstName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => navigate(`/dashboard/players/edit/${player.id}`)}
                                        className="bg-slate-900/80 hover:bg-white text-white hover:text-slate-900 p-2 rounded-lg backdrop-blur-sm transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm({ show: true, itemId: player.id, itemName: `${player.firstName} ${player.lastName}` })}
                                        className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg backdrop-blur-sm transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {player.firstName} {player.lastName}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4 capitalize">
                                    {Array.isArray(player.position) ? player.position.join(', ') : player.position}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                                        {calculateAge(player.birthDate)} años
                                    </Badge>
                                    <Badge variant="outline" className={`${player.contractStatus === 'Libre'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {player.contractStatus}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={player.isMarketplaceVisible}
                                            onCheckedChange={() => toggleVisibility(player.id, player.isMarketplaceVisible)}
                                            className="data-[state=checked]:bg-[#39FF14] scale-75"
                                        />
                                        <span className="text-xs text-slate-500">
                                            {player.isMarketplaceVisible ? 'Visible' : 'Oculto'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setPreviewPlayer(player)}
                                        className="text-slate-400 hover:text-white transition-colors"
                                        title="Vista Previa"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleShare(player.id, player.firstName, player.lastName)}
                                        className="text-slate-400 hover:text-[#39FF14] transition-colors"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-red-500/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center gap-3 text-red-400">
                                <Trash2 size={24} />
                                <h3 className="text-xl font-bold text-white">Eliminar Jugador</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-300">
                                ¿Estás seguro de que deseas eliminar a <strong className="text-white">{deleteConfirm.itemName}</strong>?
                                <br />
                                <span className="text-sm text-slate-500">Esta acción no se puede deshacer.</span>
                            </p>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, itemId: null, itemName: '' })}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => deleteConfirm.itemId && handleDelete(deleteConfirm.itemId)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Preview Modal */}
            <PlayerPreviewModal
                player={previewPlayer}
                isOpen={!!previewPlayer}
                onClose={() => setPreviewPlayer(null)}
                onEdit={(id) => navigate(`/dashboard/players/edit/${id}`)}
            />
        </div>
    );
};

export default MySquadPage;
