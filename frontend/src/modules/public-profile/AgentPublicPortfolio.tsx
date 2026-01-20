import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Users } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import { API_BASE_URL } from '@/config/api';

interface Agent {
    agencyName: string;
    logo: string | null;
    slug: string;
    contactEmail: string;
}

interface Player {
    id: string;
    firstName: string;
    lastName: string;
    position: string | string[];
    nationality: string;
    birthDate: string;
    avatarUrl: string | null;
}

interface PortfolioData {
    agent: Agent;
    players: Player[];
}

const POSITION_FILTERS = [
    { label: 'Todos', value: 'all' },
    { label: 'Portero', value: 'portero' },
    { label: 'Defensa', value: 'defensa' },
    { label: 'Mediocampista', value: 'mediocampista' },
    { label: 'Delantero', value: 'delantero' },
];


const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'portero': ['portero', 'arquero', 'goalkeeper', 'gk'],
    'defensa': ['defensa', 'defender', 'central', 'lateral', 'carrilero', 'libero', 'stopper', 'df', 'cb', 'rb', 'lb'],
    'mediocampista': ['mediocampista', 'medio', 'midfielder', 'volante', 'enganche', 'pivote', 'interior', 'mco', 'mcd', 'mc'],
    'delantero': ['delantero', 'forward', 'atacante', 'punta', 'extremo', 'ariete', 'st', 'rw', 'lw']
};

const AgentPublicPortfolio = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/public/agents/${slug}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Agencia no encontrada');
                    } else {
                        setError('Error al cargar el portafolio');
                    }
                    setIsLoading(false);
                    return;
                }
                const result = await response.json();
                // Handle backend response wrapper { statusCode, data }
                const portfolioData = result.data || result;
                setData(portfolioData);
            } catch (err) {
                console.error('Error fetching portfolio:', err);
                setError('Error de conexión');
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchPortfolio();
        }
    }, [slug]);

    const filteredPlayers = data?.players.filter(player => {
        if (selectedFilter === 'all') return true;

        const positions = Array.isArray(player.position) ? player.position : [player.position];
        const keywords = CATEGORY_KEYWORDS[selectedFilter] || [selectedFilter];

        // Check if any of the player's positions match any of the keywords for the selected category
        return positions.some(pos => {
            const lowerPos = (pos || '').toLowerCase();

            // Fix conflict: "Volante Central" matches "central" keyword in 'defensa', but it is a midfielder.
            // Explicitly exclude 'volante' from 'defensa' filter.
            if (selectedFilter === 'defensa' && lowerPos.includes('volante')) {
                return false;
            }

            return keywords.some(keyword => lowerPos.includes(keyword));
        });
    }) || [];

    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Cargando portafolio...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold text-white mb-4">
                        {error || 'Agencia no encontrada'}
                    </h1>
                    <p className="text-slate-400 mb-8">
                        Verifica que la URL sea correcta
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-[#39FF14] text-slate-950 font-bold rounded-lg hover:bg-[#32d613] transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-tactical-grid" />

            <div className="relative z-10">
                {/* Header Section */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            {/* Logo */}
                            {data.agent.logo && (
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src={data.agent.logo}
                                        alt={data.agent.agencyName}
                                        className="h-32 w-32 object-contain"
                                    />
                                </div>
                            )}

                            {/* Agency Name */}
                            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight uppercase italic">
                                {data.agent.agencyName}
                            </h1>

                            {/* Player Count */}
                            <div className="flex items-center justify-center gap-2 text-slate-400 mb-6">
                                <Users size={20} />
                                <span className="text-lg">
                                    {data.players.length} {data.players.length === 1 ? 'Jugador' : 'Jugadores'} Fichados
                                </span>
                            </div>

                            {/* Contact and Share Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {data.agent.contactEmail && (
                                    <a
                                        href={`mailto:${data.agent.contactEmail}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#39FF14] text-slate-950 font-bold rounded-lg hover:bg-[#32d613] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300"
                                    >
                                        <Mail size={20} />
                                        Contactar Agencia
                                    </a>
                                )}
                            </div>

                            {/* Share Buttons */}
                            <div className="max-w-md mx-auto mt-6">
                                <ShareButtons title={data.agent.agencyName} />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {POSITION_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedFilter(filter.value)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedFilter === filter.value
                                    ? 'bg-[#39FF14] text-slate-950 shadow-lg'
                                    : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-white/10'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Players Grid */}
                    {filteredPlayers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPlayers.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    onClick={() => navigate(`/p/${player.id}`)}
                                    className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-[#39FF14]/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all duration-300 cursor-pointer"
                                >
                                    {/* Player Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={player.avatarUrl || 'https://via.placeholder.com/400'}
                                            alt={`${player.firstName} ${player.lastName}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                                        {/* Age Badge */}
                                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                            <span className="text-xs font-bold text-white">
                                                {calculateAge(player.birthDate)} AÑOS
                                            </span>
                                        </div>

                                        {/* Player Info Overlay */}
                                        <div className="absolute bottom-0 left-0 p-4 w-full">
                                            <p className="text-[#39FF14] text-xs font-bold tracking-wider uppercase mb-1">
                                                {Array.isArray(player.position) ? player.position.join(', ') : player.position}
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
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                                <Users className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No hay jugadores</h3>
                            <p className="text-slate-400">
                                {selectedFilter === 'all'
                                    ? 'Esta agencia aún no tiene jugadores fichados.'
                                    : 'No hay jugadores en esta posición.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentPublicPortfolio;
