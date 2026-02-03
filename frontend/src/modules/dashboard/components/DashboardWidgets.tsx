import React from 'react';
import { Users, Radar, Calendar, Globe, AlertTriangle, PlayCircle, Image as ImageIcon, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// --- Types ---
export type WidgetType = 'KPI_SQUAD' | 'KPI_SCOUTING' | 'KPI_AGE' | 'KPI_QUALITY' | 'KPI_MARKET_VALUE' | 'CHART_POSITIONS' | 'CHART_FUNNEL' | 'LIST_ALERTS' | 'LIST_EXPIRING' | 'LIST_RECENT';

export interface DashboardWidgetProps {
    data: any;
    onEdit?: (id: string) => void;
}

// --- Components ---

const KPICard = ({ title, value, subtitle, icon: Icon, accent, delay = 0 }: any) => (
    <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4 shadow-lg h-full">
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
            style={{ backgroundColor: `${accent}20`, color: accent }}
        >
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <p className="text-slate-400 text-sm">{title}</p>
            <div className="text-2xl font-bold text-white">
                {value}
            </div>
            <p className="text-slate-500 text-xs">{subtitle}</p>
        </div>
    </div>
);

const PositionChart = ({ data }: any) => {
    const COLORS = ['#39FF14', '#0EA5E9', '#E2E8F0', '#94A3B8'];

    return (
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Plantel</p>
                    <h3 className="text-white text-xl font-display font-bold">Distribución</h3>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        Sin datos.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={3}
                            >
                                {data.map((_: any, index: number) => (
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
    );
};

const AlertsList = ({ data }: any) => (
    <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={18} />
                <h3 className="text-white text-lg font-display font-bold">Atención ⚠️</h3>
            </div>
            <span className="text-xs text-slate-500">{data.length} pendientes</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {data.length === 0 ? (
                <p className="text-slate-500 text-sm">Todo en orden.</p>
            ) : (
                data.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 overflow-hidden shrink-0">
                                {p.avatarUrl ? (
                                    <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={14} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{p.firstName} {p.lastName}</p>
                                <p className="text-slate-500 text-[10px]">
                                    {!p.videoUrl && 'Sin video'} {(!p.videoUrl && !p.avatarUrl) ? '·' : ''} {!p.avatarUrl && 'Sin foto'}
                                </p>
                            </div>
                        </div>
                        <a
                            href={`/dashboard/players/edit/${p.id}`}
                            className="text-[10px] px-2 py-1 rounded-lg bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30 hover:bg-[#39FF14]/25 transition-colors"
                        >
                            <Edit2 size={10} />
                        </a>
                    </div>
                ))
            )}
        </div>
    </div>
);

const RecentSigningsList = ({ data }: any) => (
    <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-display font-bold">Fichajes</h3>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {data.length === 0 ? (
                <p className="text-slate-500 text-sm">Sin fichajes.</p>
            ) : (
                data.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 overflow-hidden shrink-0">
                                {p.avatarUrl ? (
                                    <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={14} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{p.firstName} {p.lastName}</p>
                                <p className="text-slate-500 text-[10px]">
                                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/D'}
                                </p>
                            </div>
                        </div>
                        {p.videoUrl ? (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30">Video</span>
                        ) : (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1">
                                <PlayCircle size={10} /> No
                            </span>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
);


// --- New Components ---

const MarketValueWidget = ({ data }: any) => (
    <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4 shadow-lg h-full">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-emerald-500/20 text-emerald-500">
            <div className="text-xl font-bold">$</div>
        </div>
        <div className="flex-1">
            <p className="text-slate-400 text-sm">Valor de Mercado</p>
            <div className="text-2xl font-bold text-white">
                {data.totalMarketValue}
            </div>
            <p className="text-emerald-500 text-xs flex items-center gap-1">
                Total Plantila
            </p>
        </div>
    </div>
);

const FunnelChart = ({ data }: any) => {
    // Data expected: [{ name: 'Observando', value: 10 }, { name: 'Contactado', value: 5 }, ...]
    return (
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl h-full flex flex-col">
            <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pipeline</p>
                <h3 className="text-white text-xl font-display font-bold">Scouting Funnel</h3>
            </div>
            <div className="flex-1 min-h-0 space-y-3 flex flex-col justify-center">
                {data.map((item: any, index: number) => (
                    <div key={item.name} className="relative">
                        <div className="flex justify-between text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">
                            <span>{item.name}</span>
                            <span className="text-white">{item.value}</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percent}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExpiringContractsList = ({ data }: any) => (
    <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 shadow-xl h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Calendar className="text-red-500" size={18} />
                <h3 className="text-white text-lg font-display font-bold">Vencimientos</h3>
            </div>
            <span className="text-xs text-slate-500">{data.length} alertas</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {data.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                    <Calendar size={24} className="opacity-20" />
                    <p>Sin vencimientos próximos.</p>
                </div>
            ) : (
                data.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-3 border border-red-500/20">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                <img src={p.avatarUrl || 'https://via.placeholder.com/32'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{p.firstName} {p.lastName}</p>
                                <p className="text-red-400 text-[10px] font-mono">
                                    Vence: {p.expiryDate}
                                </p>
                            </div>
                        </div>
                        <a
                            href={`/dashboard/players/edit/${p.id}`} // Or logic to trigger renewal
                            className="text-[10px] px-2 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                            Ver
                        </a>
                    </div>
                ))
            )}
        </div>
    </div>
);


// --- Registry ---

export const WIDGETS_REGISTRY: Record<string, { component: React.FC<any>, label: string, defaultW: number, defaultH: number }> = {
    KPI_SQUAD: {
        component: (props) => <KPICard {...props} title="Plantel" icon={Users} accent="#39FF14" value={props.data.signedCount} subtitle="Jugadores firmados" />,
        label: 'KPI Plantel',
        defaultW: 2, // Wider for mobile
        defaultH: 4
    },
    KPI_SCOUTING: {
        component: (props) => <KPICard {...props} title="Scouting" icon={Radar} accent="#0EA5E9" value={props.data.scoutingCount} subtitle="En observación" />,
        label: 'KPI Scouting',
        defaultW: 2,
        defaultH: 4
    },
    KPI_AGE: {
        component: (props) => <KPICard {...props} title="Edad" icon={Calendar} accent="#E2E8F0" value={props.data.avgAge} subtitle="Promedio" />,
        label: 'KPI Edad',
        defaultW: 2,
        defaultH: 4
    },
    KPI_QUALITY: {
        component: (props) => <KPICard {...props} title="Datos" icon={Globe} accent="#94A3B8" value={`${props.data.dataQuality}%`} subtitle="Con video" />,
        label: 'KPI Calidad',
        defaultW: 2,
        defaultH: 4
    },
    KPI_MARKET_VALUE: {
        component: (props) => <MarketValueWidget data={props.data} />,
        label: 'KPI Valor Mercado',
        defaultW: 2,
        defaultH: 4
    },
    CHART_POSITIONS: {
        component: (props) => <PositionChart data={props.data.pieData} />,
        label: 'Gráfico Posiciones',
        defaultW: 2,
        defaultH: 8
    },
    CHART_FUNNEL: {
        component: (props) => <FunnelChart data={props.data.funnelData} />,
        label: 'Scouting Funnel',
        defaultW: 2,
        defaultH: 8
    },
    LIST_ALERTS: {
        component: (props) => <AlertsList data={props.data.pendingCompletion} />,
        label: 'Lista Alertas Datos',
        defaultW: 2,
        defaultH: 8
    },
    LIST_EXPIRING: {
        component: (props) => <ExpiringContractsList data={props.data.expiringContracts} />,
        label: 'Lista Vencimientos',
        defaultW: 2,
        defaultH: 8
    },
    LIST_RECENT: {
        component: (props) => <RecentSigningsList data={props.data.recentSignings} />,
        label: 'Lista Fichajes',
        defaultW: 2,
        defaultH: 8
    }
};

export const renderWidget = (type: string, data: any) => {
    const gadget = WIDGETS_REGISTRY[type];
    if (!gadget) return null;
    return <gadget.component data={data} />;
};
