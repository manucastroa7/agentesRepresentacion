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
                        Sin jugadores aún
                    </div>
                )}
            </div>
        </div>
    );
};

const ScoutingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        age: '',
        club: '',
        position: '',
        status: 'observing' as ProspectStatus,
        rating: 3,
        image: ''
    });

    const filteredProspects = prospects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.club.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const observing = filteredProspects.filter(p => p.status === 'observing');
    const contacted = filteredProspects.filter(p => p.status === 'contacted');
    const priority = filteredProspects.filter(p => p.status === 'priority');

    const handleFormChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleCreate = () => {
        if (!form.name || !form.club || !form.position) return;
        const newProspect: Prospect = {
            id: crypto.randomUUID(),
            name: form.name,
            age: Number(form.age) || 0,
            club: form.club,
            position: form.position,
            status: form.status,
            rating: Number(form.rating) || 3,
            image: form.image || 'https://via.placeholder.com/150'
        };
        setProspects(prev => [newProspect, ...prev]);
        setForm({
            name: '',
            age: '',
            club: '',
            position: '',
            status: 'observing',
            rating: 3,
            image: ''
        });
        setIsFormOpen(false);
    };

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
                        onClick={() => setIsFormOpen(true)}
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

            {/* Modal Nuevo Jugador */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Scouting</p>
                                <h3 className="text-xl text-white font-display font-bold">Nuevo jugador</h3>
                            </div>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400">Nombre</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Edad</label>
                                <input
                                    value={form.age}
                                    onChange={(e) => handleFormChange('age', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                    placeholder="18"
                                    type="number"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Club</label>
                                <input
                                    value={form.club}
                                    onChange={(e) => handleFormChange('club', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                    placeholder="Club actual"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Posición</label>
                                <input
                                    value={form.position}
                                    onChange={(e) => handleFormChange('position', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                    placeholder="Extremo"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Estado</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => handleFormChange('status', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                >
                                    <option value="observing">Observando</option>
                                    <option value="contacted">Contactado</option>
                                    <option value="priority">Prioridad</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Rating (1-5)</label>
                                <input
                                    value={form.rating}
                                    onChange={(e) => handleFormChange('rating', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-slate-400">Foto (URL)</label>
                                <input
                                    value={form.image}
                                    onChange={(e) => handleFormChange('image', e.target.value)}
                                    className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#39FF14]/50 focus:outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-slate-300 hover:text-white border border-white/10 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-5 py-2 bg-[#39FF14] text-slate-950 font-bold rounded-lg hover:bg-[#32d912] transition-colors"
                            >
                                Guardar jugador
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoutingPage;
