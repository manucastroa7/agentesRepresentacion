import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit, X, Globe } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/api';
import * as RGL from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { renderWidget, type WidgetType } from './components/DashboardWidgets';
import { Link } from 'react-router-dom';

// @ts-ignore
const ResponsiveGridLayout = RGL.Responsive || RGL.default?.Responsive || RGL.default;

// Custom Width Provider Hook to avoid RGL HOC issues with React 19
const useWidth = () => {
    const [width, setWidth] = useState(1200);
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        resizeObserver.observe(containerRef);
        return () => resizeObserver.disconnect();
    }, [containerRef]);

    return { width, setContainerRef };
};

type Player = {
    id: string;
    firstName: string;
    lastName: string;
    position?: string | string[];
    birthDate?: string;
    status?: string;
    avatarUrl?: string;
    videoUrl?: string; // Legacy
    videoList?: Array<{ url: string; title?: string }>;
    videos?: Array<{ url: string; title?: string }>; // Relation
    createdAt?: string;
    marketValue?: string;
};

type PieSlice = { name: string; value: number };

const POSITION_GROUPS = [
    { label: 'Portero', keywords: ['portero', 'arquero', 'goalkeeper', 'gk'] },
    { label: 'Defensa', keywords: ['defensa', 'defender', 'cb', 'rb', 'lb', 'lateral', 'df'] },
    { label: 'Medio', keywords: ['medio', 'midfielder', 'cm', 'dm', 'mco', 'mc', 'volante'] },
    { label: 'Delantero', keywords: ['delantero', 'forward', 'fw', 'st', 'wing', 'extremo'] },
];

const DEFAULT_LAYOUT = [
    { i: 'kpi_squad', x: 0, y: 0, w: 1, h: 4, type: 'KPI_SQUAD' as WidgetType },
    { i: 'kpi_scouting', x: 1, y: 0, w: 1, h: 4, type: 'KPI_SCOUTING' as WidgetType },
    { i: 'kpi_quality', x: 2, y: 0, w: 2, h: 4, type: 'KPI_QUALITY' as WidgetType },
    { i: 'chart_pos', x: 0, y: 4, w: 4, h: 8, type: 'CHART_POSITIONS' as WidgetType },
    { i: 'list_recent', x: 0, y: 12, w: 4, h: 8, type: 'LIST_RECENT' as WidgetType },
];

const DashboardHome = () => {
    const { token, user } = useAuthStore();
    const { toast } = useToast();
    const [players, setPlayers] = useState<Player[]>([]);
    const [agentSlug, setAgentSlug] = useState<string | null>(user?.agentSlug || null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLayout, setCurrentLayout] = useState(DEFAULT_LAYOUT.map(({ type, ...rest }) => rest));
    const [widgets, setWidgets] = useState(DEFAULT_LAYOUT);
    const { width, setContainerRef } = useWidth();

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

            } finally {
                setIsLoading(false);
            }
        };

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

        // Load dashboard config
        const fetchDashboardConfig = async () => {
            if (!token) return;
            // Assuming we fetch user profile again or specific endpoint
            try {
                const response = await fetch(`${API_BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.dashboardConfig && Array.isArray(userData.dashboardConfig)) {
                        setWidgets(userData.dashboardConfig);
                        setCurrentLayout(userData.dashboardConfig.map(({ type, ...rest }: any) => rest));
                    }
                }
            } catch (e) {
                console.error("Error loading dashboard config", e);
            }
        }

        fetchPlayers();
        if (!user?.agentSlug) fetchAgentProfile();
        fetchDashboardConfig();

    }, [token, toast, user?.agentSlug]);


    // Helper to parse market value "€ 1.5M" -> 1500000
    const parseMarketValue = (val?: string) => {
        if (!val) return 0;
        try {
            const clean = val.replace(/[€$£\s]/g, '').toUpperCase();
            let multiplier = 1;
            if (clean.includes('M')) multiplier = 1000000;
            else if (clean.includes('K')) multiplier = 1000;

            const numPart = parseFloat(clean.replace(/[MK]/g, ''));
            return isNaN(numPart) ? 0 : numPart * multiplier;
        } catch (e) {
            return 0;
        }
    };

    // Helper to format large numbers
    const formatValue = (num: number) => {
        if (num >= 1000000) return `€ ${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `€ ${(num / 1000).toFixed(0)}K`;
        return `€ ${num}`;
    };

    const {
        signedPlayers,
        scoutingPlayers,
        avgAge,
        dataQuality,
        pieData,
        pendingCompletion,
        recentSignings
    } = useMemo(() => {
        const signed = players.filter(p => (p.status || '').toLowerCase() === 'signed');

        // Scouting buckets
        const watchlist = players.filter(p => (p.status || '').toLowerCase() === 'watchlist');
        const contacted = players.filter(p => (p.status || '').toLowerCase() === 'contacted');
        const priority = players.filter(p => (p.status || '').toLowerCase() === 'priority');

        const scouting = [...watchlist, ...contacted, ...priority];

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

        const hasVideo = (p: Player) => {
            return !!(
                p.videoUrl ||
                (p.videoList && p.videoList.length > 0) ||
                (p.videos && p.videos.length > 0)
            );
        };

        const dataQualityPct = players.length
            ? Math.round((players.filter(p => hasVideo(p)).length / players.length) * 100)
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
            .filter(p => !hasVideo(p) || !p.avatarUrl)
            .slice(0, 5);

        const recent = [...signed].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
        }).slice(0, 3);

        return {
            signedPlayers: signed,
            scoutingPlayers: scouting,
            avgAge: avgAgeVal ? avgAgeVal.toFixed(1) : '—',
            dataQuality: dataQualityPct,
            pieData: pie,
            pendingCompletion: pending,
            recentSignings: recent
        };
    }, [players]);

    const dashboardData = {
        signedCount: signedPlayers.length,
        scoutingCount: scoutingPlayers.length,
        avgAge,
        dataQuality,
        pieData,
        pendingCompletion,
        recentSignings
    };

    const handleLayoutChange = (layout: any) => {
        setCurrentLayout(layout);
    };

    const saveLayout = async () => {
        // Merge current layout with widget types
        const newConfig = currentLayout.map(l => {
            const widget = widgets.find(w => w.i === l.i);
            return {
                ...l,
                type: (widget?.type || 'KPI_SQUAD') as WidgetType
            };
        });

        setWidgets(newConfig); // Update local state full check

        try {
            const response = await fetch(`${API_BASE_URL}/users/dashboard-config`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newConfig)
            });

            if (response.ok) {
                toast({
                    title: "Dashboard guardado",
                    description: "Tu configuración se ha actualizado exitosamente.",
                    className: "bg-[#39FF14] text-black border-none"
                });
                setIsEditing(false);
            } else {
                throw new Error("Failed to save");
            }

        } catch (error) {
            toast({
                title: "Error al guardar",
                description: "No se pudo guardar la configuración.",
                variant: 'destructive',
            });
        }
    };


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

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Centro de comando</p>
                    <h1 className="text-3xl font-display font-bold text-white mt-1">Dashboard</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => isEditing ? saveLayout() : setIsEditing(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${isEditing
                            ? 'bg-[#39FF14] text-black hover:bg-[#32d612] border-[#39FF14]'
                            : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-700'}`}
                    >
                        {isEditing ? <Save size={16} /> : <Edit size={16} />}
                        {isEditing ? 'Guardar Cambios' : 'Personalizar'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                // Reset layout logic if needed or refetch
                                setCurrentLayout(widgets.map(({ type, ...rest }) => rest));
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all text-sm font-medium"
                        >
                            <X size={16} />
                            Cancelar
                        </button>
                    )}

                    <button
                        onClick={copyAgencyLink}
                        disabled={!agentSlug}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Globe size={16} />
                        Compartir
                    </button>
                </div>
            </div>

            <div ref={setContainerRef} className={isEditing ? "border-2 border-dashed border-[#39FF14]/30 rounded-3xl p-4 bg-[#39FF14]/5" : ""}>
                <ResponsiveGridLayout
                    className="layout"
                    width={width}
                    layouts={{ lg: currentLayout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
                    rowHeight={30}
                    // @ts-ignore
                    isDraggable={isEditing}
                    // @ts-ignore
                    isResizable={isEditing}
                    onLayoutChange={handleLayoutChange}
                    margin={[16, 16]}
                    draggableHandle=".drag-handle"
                >
                    {widgets.map(widget => (
                        <div key={widget.i} className={isEditing ? "cursor-move relative group ring-1 ring-white/10 rounded-3xl" : ""}>
                            {isEditing && (
                                <div className="absolute inset-0 z-50 bg-black/10 hover:bg-black/0 transition-colors drag-handle rounded-3xl" />
                            )}
                            {renderWidget(widget.type as WidgetType, dashboardData)}
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>

            {isEditing && (
                <div className="text-center text-slate-500 text-sm mt-4">
                    Arrastra y suelta los widgets para reorganizarlos. Haz clic en "Guardar Cambios" para aplicar.
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
