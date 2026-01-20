import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Search, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubDashboardHome = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: 'Mercado Global',
            description: 'Explora talentos, filtra por posición y contacta agencias.',
            icon: Globe,
            action: () => navigate('/dashboard/club/market'),
            color: 'bg-[#39FF14]',
            textColor: 'text-black'
        },
        {
            title: 'Mis Intereses',
            description: 'Gestiona los jugadores que has guardado o contactado.',
            icon: Search,
            action: () => navigate('/dashboard/club/interests'), // Placeholder route
            color: 'bg-blue-500',
            textColor: 'text-white'
        },
        {
            title: 'Plantel Actual',
            description: 'Visualiza y gestiona tu plantilla actual (Próximamente).',
            icon: Users,
            action: () => { },
            color: 'bg-slate-700',
            textColor: 'text-slate-300'
        },
        {
            title: 'Estadísticas',
            description: 'Analisis de rendimiento y métricas del club (Próximamente).',
            icon: TrendingUp,
            action: () => { },
            color: 'bg-slate-700',
            textColor: 'text-slate-300'
        }
    ];

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white">Panel del Club</h1>
                <p className="text-slate-400 mt-1">Bienvenido al centro de gestión deportiva.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={card.action}
                        className="bg-slate-900 border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-[#39FF14]/50 hover:shadow-lg hover:shadow-[#39FF14]/10 transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-xl ${card.color} ${card.textColor} flex items-center justify-center mb-4 shadow-lg`}>
                            <card.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#39FF14] transition-colors">
                            {card.title}
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {card.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Access / Recent Activity Placeholder */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center">
                <div className="max-w-md mx-auto">
                    <Globe className="mx-auto text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">Explora el Mercado</h3>
                    <p className="text-slate-400 mb-6">
                        Accede a nuestra base de datos global de jugadores representados y encuentra el refuerzo ideal para tu equipo.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/club/market')}
                        className="px-6 py-3 bg-[#39FF14] hover:bg-[#32d612] text-black font-bold rounded-xl transition-colors"
                    >
                        Ir al Mercado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClubDashboardHome;
