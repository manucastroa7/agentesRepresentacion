import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, Search, MoreHorizontal, MapPin,
    MessageCircle, Eye, Target
} from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import { API_BASE_URL } from '@/config/api';

// --- Types ---
type ProspectStatus = 'watchlist' | 'contacted' | 'priority';

interface Prospect {
    id: string;
    name: string;
    age: number;
    club: string;
    position: string;
    rating: number; // 1-5
    status: ProspectStatus;
    image: string;
}

// --- Components ---

const ScoutingCard = ({ prospect }: { prospect: Prospect }) => {
    return (
        <motion.div
            layoutId={prospect.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing group hover:border-white/20 transition-all shadow-lg"
        >
            <div className="flex items-start gap-3">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                        <img src={prospect.image || 'https://via.placeholder.com/150'} alt={prospect.name} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate leading-tight">{prospect.name}</h4>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                        <span className="font-medium text-slate-300">{prospect.age} años</span>
                        <span>•</span>
                        <span className="truncate">{prospect.position}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                        <MapPin size={10} />
                        <span className="truncate">{prospect.club || 'Sin Club'}</span>
                    </div>
                </div>
            </div>

            <div className="mt-2 flex justify-end">
                <a href={`/dashboard/players/edit/${prospect.id}`} className="text-[10px] text-[#39FF14] hover:underline">Ver Perfil</a>
            </div>
        </motion.div>
    );
};

const KanbanColumn = ({
    title,
    icon: Icon,
    color,
    prospects,
    count
}: {
    title: string,
    icon: any,
    color: string,
    prospects: Prospect[],
    count: number
}) => {
    return (
        <div className="flex flex-col h-full min-w-[300px] w-full md:w-1/3 bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Column Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-white/10" style={{ color, backgroundColor: `${color}15` }}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
                        <span className="text-slate-500 text-xs font-medium">{count} Prospectos</span>
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Cards Container */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                {prospects.map((prospect) => (
                    <ScoutingCard key={prospect.id} prospect={prospect} />
                ))}

                {/* Empty state */}
                {prospects.length === 0 && (
                    <div className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm font-medium text-center">
                        Sin jugadores en esta etapa
                    </div>
                )}
            </div>
        </div>
    );
};

const ScoutingPage = () => {
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${API_BASE_URL}/players`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json;

                    // Filter and Map
                    const scoutingPlayers = (Array.isArray(data) ? data : [])
                        .filter((p: any) => ['watchlist', 'contacted', 'priority'].includes(p.status))
                        .map((p: any) => ({
                            id: p.id,
                            name: `${p.firstName} ${p.lastName}`,
                            age: p.birthDate ? new Date().getFullYear() - new Date(p.birthDate).getFullYear() : 0,
                            club: p.club || '',
                            position: Array.isArray(p.position) ? p.position[0] : p.position,
                            rating: 3, // Mock rating or derive from stats
                            status: p.status as ProspectStatus,
                            image: p.avatarUrl
                        }));

                    setProspects(scoutingPlayers);
                }
            } catch (error) {
                console.error("Error fetching scouting players", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayers();
    }, [token]);

    const filteredProspects = prospects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.club.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const observing = filteredProspects.filter(p => p.status === 'watchlist');
    const contacted = filteredProspects.filter(p => p.status === 'contacted');
    const priority = filteredProspects.filter(p => p.status === 'priority');


    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">Scouting & Talentos</h1>
                    <p className="text-slate-400 mt-1 text-sm">Gestiona el pipeline de futuros fichajes.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar prospecto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/players/new')}
                        className="px-4 py-2.5 bg-[#39FF14] hover:bg-[#32d912] text-slate-950 rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">NUEVO JUGADOR</span>
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start min-h-0">
                <KanbanColumn
                    title="Observando"
                    icon={Eye}
                    color="#06b6d4" // Cyan
                    prospects={observing}
                    count={observing.length}
                />
                <KanbanColumn
                    title="Contactados"
                    icon={MessageCircle}
                    color="#f59e0b" // Amber
                    prospects={contacted}
                    count={contacted.length}
                />
                <KanbanColumn
                    title="Objetivo Prioritario"
                    icon={Target}
                    color="#39FF14" // Electric Green
                    prospects={priority}
                    count={priority.length}
                />
            </div>
        </div>
    );
};

export default ScoutingPage;
