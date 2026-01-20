import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Globe, ArrowLeft } from 'lucide-react';
import MarketFilters from '../components/MarketFilters';
import PlayerMarketCard, { type PlayerMarketData } from '../components/PlayerMarketCard';
import PlayerScoutingModal from '../components/PlayerScoutingModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MarketPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [allPlayers, setAllPlayers] = useState<PlayerMarketData[]>([]);
    const [players, setPlayers] = useState<PlayerMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerMarketData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // 1. Fetch ALL Players ONCE on mount
    useEffect(() => {
        console.log('🟢 MarketPage MOUNTED');
        const fetchPlayers = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/public/players');
                if (!response.ok) throw new Error('Failed to fetch players');

                const jsonResponse = await response.json();
                const data = jsonResponse.data || jsonResponse;

                // Map API data to Component Interface
                const mappedPlayers: PlayerMarketData[] = (Array.isArray(data) ? data : []).map((p: any) => ({
                    id: p.id,
                    firstName: p.firstName,
                    lastName: p.lastName,
                    position: p.position || 'Sin definir',
                    nationality: p.nationality || 'UNK',
                    age: p.birthDate ? new Date().getFullYear() - new Date(p.birthDate).getFullYear() : 0,
                    height: p.height,
                    weight: p.weight,
                    foot: p.foot,
                    club: p.club,
                    avatarUrl: p.avatarUrl,
                    agencyName: p.agent?.agencyName || 'Agencia Desconocida',
                    agencyLogo: p.agent?.logoUrl,
                    videoUrl: p.videoUrl,
                    contractStatus: p.contractStatus || 'Consultar',
                    marketValue: p.marketValue
                }));

                setAllPlayers(mappedPlayers);
                setPlayers(mappedPlayers); // Initial display
            } catch (error) {
                console.error('Error fetching players:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
        return () => console.log('🔴 MarketPage UNMOUNTED');
    }, []); // Empty dependency array = Run once

    // 2. Filter locally when search or params change
    useEffect(() => {
        console.log('🔍 Filtering players...', { searchQuery, params: searchParams.toString() });
        let filtered = [...allPlayers];
        // ...

        // Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.firstName.toLowerCase().includes(query) ||
                p.lastName.toLowerCase().includes(query)
            );
        }

        // Filter by Position
        const positions = searchParams.getAll('pos');
        if (positions.length > 0) {
            filtered = filtered.filter(p => positions.some(pos => p.position.includes(pos)));
        }

        // Filter by Foot
        const foot = searchParams.get('foot');
        if (foot) {
            filtered = filtered.filter(p => p.foot === foot);
        }

        // Filter by Age
        const ageRanges = searchParams.getAll('age_range');
        if (ageRanges.length > 0) {
            filtered = filtered.filter(p => {
                const age = p.age;
                return ageRanges.some(range => {
                    if (range === 'sub-20') return age < 20;
                    if (range === '20-25') return age >= 20 && age <= 25;
                    if (range === '26-30') return age >= 26 && age <= 30;
                    if (range === '30-plus') return age >= 31;
                    return false;
                });
            });
        }

        // Filter by Status
        const status = searchParams.getAll('status');
        if (status.length > 0) {
            filtered = filtered.filter(p => p.contractStatus && status.includes(p.contractStatus));
        }

        setPlayers(filtered);
    }, [allPlayers, searchQuery, searchParams]);

    const handleCardClick = (player: PlayerMarketData) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
            {/* Fixed Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 h-full border-r border-white/5 bg-slate-900">
                <MarketFilters />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header / Search Bar */}
                <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 p-6 sticky top-0 z-30 flex-shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/dashboard')}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <ArrowLeft size={24} />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                                    <Globe className="text-[#39FF14]" /> Mercado Global
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">Explora talentos de élite y conecta con agencias verificadas.</p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="text-slate-500 group-focus-within:text-[#39FF14] transition-colors" size={18} />
                            </div>
                            <Input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800 border-slate-700 text-white focus:border-[#39FF14] rounded-xl h-11 transition-all"
                            />
                        </div>
                    </div>
                </header>

                {/* Scrollable Grid */}
                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-slate-900 rounded-xl h-[420px] border border-white/5 animate-pulse relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
                                    </div>
                                ))}
                            </div>
                        ) : players.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                {players.map((player) => (
                                    <PlayerMarketCard
                                        key={player.id}
                                        player={player}
                                        onClick={() => handleCardClick(player)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                                <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                                    <Search className="text-slate-600" size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Sin resultados</h3>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    No encontramos talentos con estos criterios. Intenta ampliar tu búsqueda o limpiar los filtros.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal */}
            <PlayerScoutingModal
                player={selectedPlayer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default MarketPage;
