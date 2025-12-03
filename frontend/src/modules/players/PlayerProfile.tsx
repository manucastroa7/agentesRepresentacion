import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, MapPin, Calendar,
    TrendingUp, Play, ArrowRightLeft, Shield, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/context/authStore';
import { VideoGallery } from './components/VideoGallery';
import { API_BASE_URL } from '@/config/api';

const PlayerProfile = () => {
    const { id } = useParams();
    const token = useAuthStore((state) => state.token);
    const [activeTab, setActiveTab] = useState('overview');
    const [player, setPlayer] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPlayer = async () => {
        if (!id || !token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/players/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                const data = jsonResponse.data || jsonResponse;
                console.log('Datos recibidos:', data);
                setPlayer(data);
                setVideos(data.videos || []);
            } else {
                console.error("Error fetching player data");
                setError("No se pudo cargar el perfil del jugador.");
            }
        } catch (error) {
            console.error("Network error:", error);
            setError("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayer();
    }, [id, token]);

    const calculateAge = (dateString: string) => {
        if (!dateString) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return isNaN(age) ? 'N/A' : age;
    };

    const getVideoEmbed = (url: string) => {
        if (!url) return null;

        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/);
        if (ytMatch && ytMatch[1]) {
            return (
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }

        const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return (
                <iframe
                    className="w-full h-full"
                    src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                    title="Vimeo video player"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }

        return (
            <video controls className="w-full h-full bg-black">
                <source src={url} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
            </video>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39FF14]"></div>
                    <p className="text-white font-medium">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || "Jugador no encontrado"}</p>
                    <Link to="/dashboard/players" className="text-[#39FF14] hover:underline">Volver a la lista</Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Resumen' },
        { id: 'stats', label: 'Estadísticas' },
        { id: 'video', label: 'Video Highlights' },
        { id: 'transfers', label: 'Transferencias' }
    ];

    const age = calculateAge(player.birthDate);
    const stats = player.stats || {};

    return (
        <div className="min-h-screen bg-sport-gradient pb-12">
            {/* Header / Cover */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                <div className="container mx-auto px-6 h-full flex flex-col justify-between pb-6 relative z-10">
                    <Link to="/dashboard/players" className="mt-6 inline-flex items-center text-white/80 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-1" /> Volver a la lista
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full md:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-shrink-0"
                    >
                        <div className="aspect-[4/5] bg-slate-100 relative">
                            <img
                                src={player.avatarUrl || '/assets/default-avatar.png'}
                                alt={player.firstName ? `${player.firstName} ${player.lastName}` : 'Jugador'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                }}
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                                #{player.id.slice(0, 6)}
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h1 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                                    {player.firstName} {player.lastName}
                                </h1>
                                <p className="text-primary font-medium text-lg">{player.position || '-'}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Nacionalidad</span>
                                    <span className="font-medium text-slate-900">{player.nationality || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Edad</span>
                                    <span className="font-medium text-slate-900">{age !== 'N/A' ? `${age} años` : 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Shield className="w-4 h-4" /> Estado</span>
                                    <span className="font-medium text-slate-900 capitalize">{player.status || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Valor</span>
                                    <span className="font-bold text-green-600">{player.marketValue || '-'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Altura</p>
                                    <p className="font-bold text-slate-900">{player.height ? `${player.height} cm` : '-'}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Peso</p>
                                    <p className="font-bold text-slate-900">{player.weight ? `${player.weight} kg` : '-'}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Pie</p>
                                    <p className="font-bold text-slate-900 capitalize">
                                        {player.foot === 'right' ? 'Diestro' : player.foot === 'left' ? 'Zurdo' : player.foot === 'both' ? 'Ambidextro' : '-'}
                                    </p>
                                </div>
                            </div>

                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                                Descargar CV
                            </Button>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm mb-8 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-yellow-500" /> Rendimiento Técnico
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                    <p className="text-3xl font-display font-bold text-slate-900">{stats.speed || 0}</p>
                                                    <p className="text-sm text-slate-500">Velocidad</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                    <p className="text-3xl font-display font-bold text-slate-900">{stats.physical || 0}</p>
                                                    <p className="text-sm text-slate-500">Físico</p>
                                                </div>
                                                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                                    <p className="text-3xl font-display font-bold text-green-600">{stats.shooting || 0}</p>
                                                    <p className="text-sm text-green-700">Disparo</p>
                                                </div>
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                    <p className="text-3xl font-display font-bold text-blue-600">{stats.passing || 0}</p>
                                                    <p className="text-sm text-blue-700">Pase</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 className="text-lg font-bold text-slate-900 mb-4">Información Adicional</h3>
                                            {player.additionalInfo && player.additionalInfo.length > 0 ? (
                                                <div className="space-y-3">
                                                    {player.additionalInfo.map((info: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                                                            <span className="text-slate-500 text-sm">{info.label}</span>
                                                            <span className="font-bold text-slate-900">{info.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 text-sm italic">No hay información adicional.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'video' && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-4">Galería de Videos</h3>
                                            <VideoGallery
                                                playerId={id!}
                                                videos={videos}
                                                onVideoUploaded={fetchPlayer}
                                                onVideoDeleted={fetchPlayer}
                                            />
                                        </div>

                                        {/* Legacy Video URL Field */}
                                        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-4">Video Principal (Link Externo)</h3>
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-slate-400 mb-1">URL de YouTube / Vimeo</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={player?.videoUrl || ''}
                                                            onChange={(e) => setPlayer({ ...player, videoUrl: e.target.value })}
                                                            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                                                            placeholder="https://youtube.com/..."
                                                        />
                                                        <button className="px-4 py-2 bg-[#39FF14] text-slate-950 font-bold rounded-lg hover:bg-[#32e612] transition-colors">
                                                            Guardar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {player?.videoUrl && (
                                                <div className="mt-6 aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                                                    {getVideoEmbed(player.videoUrl)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'transfers' && (
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <ArrowRightLeft className="w-5 h-5 text-slate-400" /> Historial
                                        </h3>
                                        <p className="text-slate-500 italic">Próximamente...</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfile;
