import { useState, useEffect } from 'react';
import api from '@/services/api';
import PlayerCard from '../components/PlayerCard';
import type { PublicPlayerCardData } from '../components/PlayerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketplacePage = () => {
    const [players, setPlayers] = useState<PublicPlayerCardData[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [position, setPosition] = useState<string>('');
    const [contractStatus, setContractStatus] = useState<string>('');
    const [minAge, setMinAge] = useState<string>('');
    const [maxAge, setMaxAge] = useState<string>('');

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (position && position !== 'all') params.position = position;
            if (contractStatus && contractStatus !== 'all') params.contractStatus = contractStatus;
            if (minAge) params.minAge = minAge;
            if (maxAge) params.maxAge = maxAge;

            const { data } = await api.get('/market', { params });
            setPlayers(data);
        } catch (error) {
            console.error('Error fetching market players:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPlayers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [position, contractStatus, minAge, maxAge]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Red de Talentos Agent Sport</h1>
                    <p className="text-slate-500 mt-2">Explorar portfolios profesionales gestionados.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
                            <h2 className="font-semibold text-lg mb-4 text-slate-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                Filtros
                            </h2>

                            {/* Position */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Posición</label>
                                <Select onValueChange={setPosition} value={position}>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="Arquero">Arquero</SelectItem>
                                        <SelectItem value="Defensor">Defensor</SelectItem>
                                        <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                                        <SelectItem value="Delantero">Delantero</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Contract Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Estado</label>
                                <Select onValueChange={setContractStatus} value={contractStatus}>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="Libre">Libre</SelectItem>
                                        <SelectItem value="Con Contrato">Con Contrato</SelectItem>
                                        <SelectItem value="Prestamo">Préstamo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Age Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Edad</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minAge}
                                        onChange={(e) => setMinAge(e.target.value)}
                                        className="w-full bg-white"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxAge}
                                        onChange={(e) => setMaxAge(e.target.value)}
                                        className="w-full bg-white"
                                    />
                                </div>
                            </div>

                            {/* Reset Button */}
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => {
                                    setPosition('all');
                                    setContractStatus('all');
                                    setMinAge('');
                                    setMaxAge('');
                                }}
                            >
                                Limpiar Filtros
                            </Button>
                        </div>
                    </aside>

                    {/* Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-96 bg-white rounded-xl border border-slate-200 animate-pulse p-4">
                                        <div className="h-32 bg-slate-100 rounded-full w-32 mx-auto mb-4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto mb-2"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        ) : players.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {players.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No se encontraron jugadores</h3>
                                <p className="text-slate-500 mt-1 max-w-xs text-center">Intenta ajustar los filtros para ver más resultados.</p>
                                <Button
                                    variant="link"
                                    className="mt-2 text-indigo-600"
                                    onClick={() => {
                                        setPosition('all');
                                        setContractStatus('all');
                                        setMinAge('');
                                        setMaxAge('');
                                    }}
                                >
                                    Limpiar todos los filtros
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MarketplacePage;
