import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const PlayerManagement = () => {
    const players = [
        { id: '10', name: 'Thiago Almada', team: 'Atlanta United', position: 'Mediocentro Ofensivo', value: '€27.00M', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop' },
        { id: '19', name: 'Julián Álvarez', team: 'Manchester City', position: 'Delantero Centro', value: '€90.00M', image: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1000&auto=format&fit=crop' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Gestión de Plantel</h2>
                    <p className="text-slate-500 mt-1">Administra tus jugadores y sus perfiles profesionales.</p>
                </div>
                <button className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-full shadow-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 hover:scale-105 active:scale-95">
                    <Plus className="mr-2 h-5 w-5" />
                    Nuevo Jugador
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                    <Link to={`/dashboard/players/${player.id}`} key={player.id} className="group">
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img src={player.image} alt={player.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded mb-1 inline-block">{player.position}</p>
                                    <h3 className="text-xl font-bold font-display">{player.name}</h3>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between bg-white flex-1">
                                <div>
                                    <p className="text-xs text-slate-500">Equipo</p>
                                    <p className="font-bold text-slate-900 text-sm">{player.team}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Valor</p>
                                    <p className="font-bold text-green-600 text-sm">{player.value}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PlayerManagement;
