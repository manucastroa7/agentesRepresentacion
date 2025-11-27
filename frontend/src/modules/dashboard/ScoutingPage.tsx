import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, MoreHorizontal, MapPin,
    MessageCircle, Eye, Target
} from 'lucide-react';

// --- Types ---
type ProspectStatus = 'observing' | 'contacted' | 'priority';

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
const MOCK_PROSPECTS: Prospect[] = [
    {
        id: '1',
        name: 'Gianluca Prestianni',
        age: 17,
        club: 'Vélez Sarsfield',
        position: 'Extremo',
        rating: 5,
        status: 'observing',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Federico Redondo',
        age: 20,
        club: 'Argentinos Jrs',
        position: 'Mediocentro',
        rating: 4.5,
        status: 'observing',
        image: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'Agustín Ruberto',
        age: 17,
        club: 'River Plate',
        position: 'Delantero',
        rating: 4,
        status: 'contacted',
        image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '4',
        name: 'Franco Mastantuono',
        age: 16,
        club: 'River Plate',
        position: 'Mediapunta',
        rating: 5,
        status: 'priority',
        image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '5',
        name: 'Ian Subiabre',
        age: 17,
        club: 'River Plate',
        position: 'Extremo',
        rating: 4,
        status: 'contacted',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=200&auto=format&fit=crop'
    }
];

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
                        <img src={prospect.image} alt={prospect.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5 border border-white/10">
                        <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                            {prospect.rating}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate leading-tight">{prospect.name}</h4>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                        <span className="font-medium text-slate-300">{prospect.age} años</span>
                        <span>•</span>
                        <span className="truncate">{prospect.position}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-1">
                        <MapPin size={10} />
                        <span className="truncate">{prospect.club}</span>
                    </div>
                </div>
            </div>

            {/* Badges / Tags */}
            <div className="mt-3 flex items-center gap-2">
                {prospect.rating >= 4.5 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-bold uppercase tracking-wider border border-[#39FF14]/20">
                        Talento Top
                    </span>
                )}
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
                    <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`} style={{ color: color, backgroundColor: `${color}1A` }}>
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

                {/* Add Button Placeholder */}
                <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm font-medium hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2 group">
                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                    Añadir a {title}
                </button>
            </div>
        </div>
    );
};

const ScoutingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProspects = MOCK_PROSPECTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.club.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const observing = filteredProspects.filter(p => p.status === 'observing');
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
                    <button className="px-4 py-2.5 bg-[#39FF14] hover:bg-[#32d912] text-slate-950 rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center gap-2 whitespace-nowrap">
                        <Plus size={18} />
                        <span className="hidden sm:inline">NUEVO PROSPECTO</span>
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
