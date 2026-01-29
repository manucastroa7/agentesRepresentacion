import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Radar, Calendar, Globe, AlertTriangle, PlayCircle, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/api';

type Player = {
    id: string;
    firstName: string;
    lastName: string;
    position?: string | string[];
    birthDate?: string;
    status?: string;
    avatarUrl?: string;
    videoUrl?: string;
    createdAt?: string;
};

type PieSlice = { name: string; value: number };

const POSITION_GROUPS = [
    { label: 'Portero', keywords: ['portero', 'arquero', 'goalkeeper', 'gk'] },
    { label: 'Defensa', keywords: ['defensa', 'defender', 'cb', 'rb', 'lb', 'lateral', 'df'] },
    { label: 'Medio', keywords: ['medio', 'midfielder', 'cm', 'dm', 'mco', 'mc', 'volante'] },
    { label: 'Delantero', keywords: ['delantero', 'forward', 'fw', 'st', 'wing', 'extremo'] },
];

const COLORS = ['#39FF14', '#0EA5E9', '#E2E8F0', '#94A3B8'];

const DashboardHome = () => {
    const { token, user } = useAuthStore();
    const { toast } = useToast();
    const [players, setPlayers] = useState<Player[]>([]);
    const [agentSlug, setAgentSlug] = useState<string | null>(user?.agentSlug || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${API_BASE_URL}/players`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error(`Status ${response.status}`);
                const json = await response.json();
                const data = json.data || json;
                setPlayers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching players', error);
                toast({
                    title: 'No se pudieron cargar los jugadores',
                    description: 'Intenta nuevamente o revisa tu conexión.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlayers();
    }, [token, toast]);

    useEffect(() => {
        const fetchAgentProfile = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${API_BASE_URL}/agents/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json;
                    setAgentSlug(data.slug);
                }
            } catch (error) {
                console.error('Error fetching agent profile', error);
            }
        };

        if (!user?.agentSlug) {
            fetchAgentProfile();
        }
    }, [token, user?.agentSlug]);

    const {
        signedPlayers,
        scoutingPlayers,
        avgAge,
        dataQuality,
        pieData,
        pendingCompletion,
        recentSignings,
    } = useMemo(() => {
        const signed = players.filter(p => (p.status || '').toLowerCase() === 'signed');
        const scouting = players.filter(p => {
            const status = (p.status || '').toLowerCase();
            return status === 'watchlist' || status === 'priority';
        });

        const ageFromBirth = (birth?: string) => {
            if (!birth) return null;
            const dob = new Date(birth);
            if (Number.isNaN(dob.getTime())) return null;
            const diff = Date.now() - dob.getTime();
            return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        };

        const ages = signed
            .map(p => ageFromBirth(p.birthDate))
            .filter((a): a is number => a !== null);
        const avgAgeVal = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

        const dataQualityPct = players.length
            ? Math.round((players.filter(p => !!p.videoUrl).length / players.length) * 100)
            : 0;

        const groupPosition = (pos?: string | string[]) => {
            const primaryPos = Array.isArray(pos) ? pos[0] : pos;
            const normalized = (primaryPos || '').toLowerCase();
            const found = POSITION_GROUPS.find(group =>
                group.keywords.some(k => normalized.includes(k))
            );
            return found?.label || 'Sin posición';
        };

        const pieGrouped = signed.reduce<Record<string, number>>((acc, player) => {
            const group = groupPosition(player.position);
            acc[group] = (acc[group] || 0) + 1;
            return acc;
        }, {});
        const pie: PieSlice[] = Object.entries(pieGrouped).map(([name, value]) => ({ name, value }));

        const pending = players
            .filter(p => !p.videoUrl || !p.avatarUrl)
            .slice(0, 5);

        const recent = [...signed].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
        }).slice(0, 3);

        return {
            signedPlayers: signed,
            scoutingPlayers: scouting,
            avgAge: avgAgeVal,
            dataQuality: dataQualityPct,
            pieData: pie,
            pendingCompletion: pending,
            recentSignings: recent,
        };
    }, [players]);

    const copyAgencyLink = () => {
        if (!agentSlug) return;
        const url = `${window.location.origin}/u/${agentSlug}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Enlace de Portfolio Copiado",
            description: "El link de tu portafolio público ha sido copiado.",
            className: "bg-[#39FF14] text-black border-none"
        });
    };

    const kpiCards = [
        {
            title: 'Plantel',
            value: signedPlayers.length,
            icon: Users,
            accent: '#39FF14',
            subtitle: 'Jugadores firmados',
        },
        {
            title: 'Scouting',
            value: scoutingPlayers.length,
            icon: Radar,
            accent: '#0EA5E9',
            subtitle: 'En observación',
        },
        {
            title: 'Edad Promedio',
            value: avgAge ? avgAge.toFixed(1) : '—',
            icon: Calendar,
            accent: '#E2E8F0',
            subtitle: 'Plantel firmado',
        },
        {
            title: 'Calidad de Datos',
            value: `${dataQuality}%`,
            icon: Globe,
            accent: '#94A3B8',
            subtitle: 'Con video cargado',
        },
    ];

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Centro de comando</p>
                    <h1 className="text-3xl font-display font-bold text-white mt-1">Dashboard</h1>
                </div>
                <button
                    onClick={copyAgencyLink}
                    disabled={!agentSlug}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Globe size={16} />
                    Compartir Sitio Público
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiCards.map((card, idx) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4 shadow-lg"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                            style={{ backgroundColor: `${card.accent}20`, color: card.accent }}
                        >
                            <card.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-400 text-sm">{card.title}</p>
                            <motion.div
                                key={card.value}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-bold text-white"
                            >
                                {isLoading ? '...' : card.value}
                            </motion.div>
                            <p className="text-slate-500 text-xs">{card.subtitle}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <div className="xl:col-span-2 bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Plantel</p>
                            <h3 className="text-white text-xl font-display font-bold">Distribución del Plantel</h3>
                        </div>
                    </div>
                    <div className="h-80">
                        {pieData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                Sin datos para mostrar aún.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={3}
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const item = payload[0];
                                                return (
                                                    <div className="bg-slate-900 text-white text-sm border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                                                        <p className="font-bold">{item.name}</p>
                                                        <p className="text-slate-300">Jugadores: {item.value}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="text-amber-400" size={18} />
                            <h3 className="text-white text-lg font-display font-bold">Atención Requerida ⚠️</h3>
                        </div>
                        <span className="text-xs text-slate-500">{pendingCompletion.length} pendientes</span>
                    </div>
                    {pendingCompletion.length === 0 ? (
                        <p className="text-slate-500 text-sm">Todos los perfiles tienen video y foto.</p>
                    ) : (
                        <div className="space-y-3">
                            {pendingCompletion.map((p) => (
                                <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 overflow-hidden">
                                            {p.avatarUrl ? (
                                                <img src={p.avatarUrl} alt={`${p.firstName} ${p.lastName}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={16} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{p.firstName} {p.lastName}</p>
                                            <p className="text-slate-500 text-xs">
                                                {!p.videoUrl && 'Sin video'} {(!p.videoUrl && !p.avatarUrl) ? '·' : ''} {!p.avatarUrl && 'Sin foto'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = `/dashboard/players/edit/${p.id}`}
                                        className="text-xs px-3 py-1 rounded-lg bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30 hover:bg-[#39FF14]/25 transition-colors flex items-center gap-1"
                                    >
                                        <Edit2 size={12} /> Editar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Latest Signings */}
            <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-display font-bold">Últimos fichajes</h3>
                    <span className="text-xs text-slate-500">3 más recientes</span>
                </div>
                {recentSignings.length === 0 ? (
                    <p className="text-slate-500 text-sm">Aún no hay fichajes registrados.</p>
                ) : (
                    <div className="space-y-2">
                        {recentSignings.map((p) => (
                            <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 overflow-hidden">
                                        {p.avatarUrl ? (
                                            <img src={p.avatarUrl} alt={`${p.firstName} ${p.lastName}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users size={16} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-semibold truncate">{p.firstName} {p.lastName}</p>
                                        <p className="text-slate-500 text-xs">
                                            Alta: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/D'}
                                        </p>
                                    </div>
                                </div>
                                {p.videoUrl ? (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30">Con video</span>
                                ) : (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1">
                                        <PlayCircle size={12} /> Sin video
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
