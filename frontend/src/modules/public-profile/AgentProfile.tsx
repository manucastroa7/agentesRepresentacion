import { Globe, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

const AgentProfile = () => {
    // Mock Data
    const agent = {
        name: 'Manuel Castro',
        agency: 'MC Sports Management',
        location: 'Madrid, España',
        email: 'manu@mcsports.com',
        phone: '+34 612 345 678',
        website: 'www.mcsports.com',
        bio: 'Representación integral de talentos jóvenes con proyección internacional. Más de 10 años de experiencia en el mercado europeo y sudamericano.',
        stats: {
            players: 24,
            transfers: '€45M',
            experience: '12 Años',
        },
    };

    const players = [
        { id: 1, name: 'Thiago Almada', position: 'Mediocentro Ofensivo', age: 22, club: 'Atlanta United', value: '€27.00m', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=500' },
        { id: 2, name: 'Valentín Barco', position: 'Lateral Izquierdo', age: 19, club: 'Brighton & Hove Albion', value: '€13.00m', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=500' },
        { id: 3, name: 'Alan Varela', position: 'Pivote', age: 22, club: 'FC Porto', value: '€14.00m', image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=500' },
        { id: 4, name: 'Exequiel Zeballos', position: 'Extremo Izquierdo', age: 21, club: 'Boca Juniors', value: '€6.50m', image: 'https://images.unsplash.com/photo-1543326727-56c9a24f49e3?auto=format&fit=crop&q=80&w=500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Cover */}
            <div className="bg-secondary text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-football-pattern opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="container mx-auto px-6 py-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-secondary text-4xl font-bold shadow-2xl border-4 border-white/10">
                            MC
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-display font-bold mb-2">{agent.agency}</h1>
                                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {agent.location}</span>
                                        <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {agent.website}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Instagram className="w-5 h-5" /></button>
                                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Twitter className="w-5 h-5" /></button>
                                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Linkedin className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <p className="mt-6 text-gray-300 max-w-2xl leading-relaxed">
                                {agent.bio}
                            </p>

                            <div className="mt-8 flex gap-8 border-t border-white/10 pt-6">
                                <div>
                                    <p className="text-3xl font-bold text-primary">{agent.stats.players}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Jugadores</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-accent">{agent.stats.transfers}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Valor Mercado</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">{agent.stats.experience}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Experiencia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Players Grid */}
            <div className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Plantel Representado
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {players.map((player) => (
                        <div key={player.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                            <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                                <img
                                    src={player.image}
                                    alt={player.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <p className="text-white text-xs font-bold uppercase tracking-wider mb-1 bg-primary px-2 py-0.5 rounded w-fit">{player.position}</p>
                                    <h3 className="text-white font-display font-bold text-xl leading-tight">{player.name}</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">{player.club}</span>
                                    <span className="text-sm font-bold text-gray-900">{player.age} años</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase">Valor de Mercado</span>
                                    <span className="font-bold text-primary">{player.value}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Footer */}
            <div className="bg-white border-t border-gray-200 py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Interesado en algún jugador?</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={`mailto:${agent.email}`} className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                            <Mail className="w-5 h-5 mr-2" /> Contactar por Email
                        </a>
                        <a href={`tel:${agent.phone}`} className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            <Phone className="w-5 h-5 mr-2" /> Llamar Agencia
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentProfile;
