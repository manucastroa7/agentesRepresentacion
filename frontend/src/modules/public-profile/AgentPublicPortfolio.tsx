import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Users } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import * as Slider from '@radix-ui/react-slider';
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
    passport?: string; // Added passport field
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

    // Filter States
    const [selectedFilter, setSelectedFilter] = useState('all'); // Position Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNation, setSelectedNation] = useState('all');
    const [selectedPassport, setSelectedPassport] = useState('all'); // Passport Filter
    const [ageRange, setAgeRange] = useState<{ min: number; max: number }>({ min: 15, max: 40 });

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

    // Extract unique nationalities for filter dropdown (Trimmed, Split & Sorted)
    const uniqueNationalities = Array.from(new Set(
        data?.players
            .map(p => p.nationality)
            .filter(Boolean)
            .flatMap(nat => nat.split(/[\/,;&+-]/).map(n => n.trim())) // Split by common separators
            .filter(n => n.length > 0)
    )).sort() as string[];

    // Extract unique passports for filter dropdown
    const uniquePassports = Array.from(new Set(
        data?.players
            .map(p => p.passport)
            .filter(Boolean)
            .flatMap(pass => pass ? pass.split(/[\/,;&+-]/).map(p => p.trim()) : [])
            .filter(p => p.length > 0)
    )).sort() as string[];

    const filteredPlayers = data?.players.filter(player => {
        // 1. Position Filter
        let matchesPosition = false;
        if (selectedFilter === 'all') {
            matchesPosition = true;
        } else {
            const positions = Array.isArray(player.position) ? player.position : [player.position];
            const keywords = CATEGORY_KEYWORDS[selectedFilter] || [selectedFilter];
            matchesPosition = positions.some(pos => {
                const lowerPos = (pos || '').toLowerCase();
                if (selectedFilter === 'defensa' && lowerPos.includes('volante')) return false;
                return keywords.some(keyword => lowerPos.includes(keyword));
            });
        }

        // 2. Search Filter (Name)
        const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
        const matchesSearch = searchQuery === '' || fullName.includes(searchQuery.toLowerCase());

        // 3. Nationality Filter (Check if player has the selected nationality)
        const matchesNation = selectedNation === 'all' ||
            (player.nationality && player.nationality.toLowerCase().includes(selectedNation.toLowerCase()));

        // 4. Passport Filter
        const matchesPassport = selectedPassport === 'all' ||
            (player.passport && player.passport.toLowerCase().includes(selectedPassport.toLowerCase()));

        // 5. Age Filter
        const age = calculateAge(player.birthDate);
        const matchesAge = age >= ageRange.min && age <= ageRange.max;

        return matchesPosition && matchesSearch && matchesNation && matchesPassport && matchesAge;
    }) || [];

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
                                    {data.players.length} {data.players.length === 1 ? 'Jugador' : 'Jugadores'}
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
                                        Enviar por mail
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

                {/* Main Content Area: Sidebar Filters + Players Grid */}
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-72 lg:shrink-0 space-y-8 bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 lg:sticky lg:top-8 z-20 h-fit">
                            <div>
                                <h3 className="text-xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">Filtros</h3>

                                <div className="space-y-6">
                                    {/* Name Search */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Buscar</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre del jugador..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#39FF14]/50 transition-colors"
                                        />
                                    </div>

                                    {/* Position Filter (Vertical Pills) */}
                                    <div className="space-y-3">
                                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Posición</label>
                                        <div className="flex flex-col gap-2">
                                            {POSITION_FILTERS.map((filter) => (
                                                <button
                                                    key={filter.value}
                                                    onClick={() => setSelectedFilter(filter.value)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300 w-full text-left flex justify-between items-center group ${selectedFilter === filter.value
                                                        ? 'bg-[#39FF14] text-slate-950 shadow-lg'
                                                        : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    {filter.label}
                                                    <span className={`w-2 h-2 rounded-full ${selectedFilter === filter.value ? 'bg-slate-950' : 'bg-transparent group-hover:bg-[#39FF14]'}`}></span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nationality Select */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Nacionalidad</label>
                                        <select
                                            value={selectedNation}
                                            onChange={(e) => setSelectedNation(e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="all">Todas</option>
                                            {uniqueNationalities.map(nat => (
                                                <option key={nat} value={nat}>{nat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Passport Select */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pasaporte</label>
                                        <select
                                            value={selectedPassport}
                                            onChange={(e) => setSelectedPassport(e.target.value)}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="all">Todos</option>
                                            {uniquePassports.map(passport => (
                                                <option key={passport} value={passport}>{passport}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Age Filter (Slider) */}
                                    <div className="space-y-4 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                            <span>Edad</span>
                                            <span className="text-[#39FF14]">{ageRange.min} - {ageRange.max} años</span>
                                        </div>
                                        <Slider.Root
                                            className="relative flex items-center select-none touch-none w-full h-5"
                                            value={[ageRange.min, ageRange.max]}
                                            max={50}
                                            min={15}
                                            step={1}
                                            minStepsBetweenThumbs={1}
                                            onValueChange={(value) => setAgeRange({ min: value[0], max: value[1] })}
                                        >
                                            <Slider.Track className="bg-slate-800 relative grow rounded-full h-[3px]">
                                                <Slider.Range className="absolute bg-[#39FF14] rounded-full h-full" />
                                            </Slider.Track>
                                            <Slider.Thumb
                                                className="block w-4 h-4 bg-slate-950 border-2 border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)] rounded-full hover:bg-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 transition-colors cursor-grab active:cursor-grabbing"
                                                aria-label="Edad mínima"
                                            />
                                            <Slider.Thumb
                                                className="block w-4 h-4 bg-slate-950 border-2 border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)] rounded-full hover:bg-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 transition-colors cursor-grab active:cursor-grabbing"
                                                aria-label="Edad máxima"
                                            />
                                        </Slider.Root>
                                    </div>

                                    {/* Clear Filters Button */}
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedFilter('all');
                                            setSelectedNation('all');
                                            setSelectedPassport('all');
                                            setAgeRange({ min: 0, max: 100 });
                                        }}
                                        className="w-full mt-4 py-2 text-center text-slate-400 text-sm hover:text-[#39FF14] transition-colors border border-dashed border-white/10 hover:border-[#39FF14]/30 rounded-lg bg-slate-950/50"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Players Grid Section */}
                        <div className="flex-1 w-full">
                            {/* Results Count & Current Filter Tags (Optional) */}
                            <div className="flex justify-between items-center mb-6 pl-2">
                                <h2 className="text-xl text-white font-medium">
                                    Mostrando <span className="text-[#39FF14] font-bold">{filteredPlayers.length}</span> {filteredPlayers.length === 1 ? 'jugador' : 'jugadores'}
                                </h2>
                            </div>

                            {filteredPlayers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin size={12} />
                                                            <span>{player.nationality}</span>
                                                        </div>
                                                        {player.passport && (
                                                            <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                                                                <span className="opacity-70">Pass:</span>
                                                                <span>{player.passport}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-white/5 border-dashed">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                                        <Users className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No se encontraron jugadores</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto">
                                        No hay coincidencias para los filtros actuales. Intenta suavizar tu búsqueda.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedFilter('all');
                                            setSelectedNation('all');
                                            setSelectedPassport('all');
                                            setAgeRange({ min: 0, max: 100 });
                                        }}
                                        className="mt-6 px-6 py-2 bg-[#39FF14]/10 text-[#39FF14] text-sm font-bold uppercase rounded-lg hover:bg-[#39FF14]/20 transition-colors"
                                    >
                                        Limpiar todos los filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentPublicPortfolio;
