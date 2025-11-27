import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Ruler, Weight, Activity, Play } from 'lucide-react';

// Reusing the slider component but making it read-only
const AttributeSlider = ({ label, value, color = "#39FF14" }: { label: string, value: number, color?: string }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</label>
                <span className="text-xl font-bold text-white font-display">{value}</span>
            </div>
            <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
                />
            </div>
        </div>
    );
};

const PublicPlayerProfile = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await fetch(`http://localhost:3000/public/players/${playerId}`);
                if (!response.ok) throw new Error('Jugador no encontrado');
                const json = await response.json();
                const data = json.data || json;
                console.log('Public Profile Data:', data);
                setPlayer(data);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el perfil del jugador.');
            } finally {
                setLoading(false);
            }
        };

        if (playerId) fetchPlayer();
    }, [playerId]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando perfil...</div>;
    if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">{error}</div>;
    if (!player) return null;

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

    const age = calculateAge(player.birthDate);
    const stats = player.stats || {};

    const getVideoEmbed = (url: string) => {
        if (!url) return null;

        // YouTube
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/);
        if (ytMatch && ytMatch[1]) {
            return (
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                    title="Player Highlights"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }

        // Vimeo
        const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return (
                <iframe
                    className="w-full h-full"
                    src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                    title="Player Highlights"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }

        // Direct file
        return (
            <video controls className="w-full h-full object-cover" poster={player.avatarUrl}>
                <source src={url} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
            </video>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const isDirectVideo = (url: string) => {
        return !url.includes('youtube') && !url.includes('youtu.be') && !url.includes('vimeo');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#39FF14] selection:text-slate-950 pb-20 print:bg-white print:text-black print:pb-0">
            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { margin: 1.5cm; size: A4; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .print-break-inside { break-inside: avoid; }
                    /* Force dark backgrounds to be light for print savings, or keep specific elements dark if needed. 
                       Here we'll make it clean black/white for a datasheet. */
                    .bg-slate-950 { background: white !important; }
                    .text-white { color: black !important; }
                    .text-slate-400 { color: #666 !important; }
                    .border-white\\/10 { border-color: #ddd !important; }
                    .bg-slate-900\\/80 { background: #f8f8f8 !important; border: 1px solid #ddd !important; }
                    .bg-slate-900\\/50 { background: #fff !important; border: 1px solid #eee !important; }
                }
            `}</style>

            {/* Background Pattern (Hide in Print) */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none no-print"
                style={{
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden print:h-auto print:overflow-visible print:mb-8">
                <img
                    src={player.avatarUrl || 'https://via.placeholder.com/1920x1080'}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-full h-full object-cover object-top print:h-64 print:object-contain print:object-left"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent no-print" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto print:relative print:p-0 print:text-black">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4 print:mb-2">
                            <span className="px-4 py-1 bg-[#39FF14] text-slate-950 font-bold uppercase tracking-wider text-sm rounded-full print:border print:border-black print:bg-transparent">
                                {player.position}
                            </span>
                            <div className="flex items-center gap-2 text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 print:text-black print:bg-transparent print:border-0 print:p-0">
                                <MapPin size={14} />
                                <span className="text-sm font-medium">{player.nationality}</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-display font-bold text-white leading-none mb-2 tracking-tight print:text-black print:text-4xl">
                            {player.firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 print:text-black print:bg-none">{player.lastName}</span>
                        </h1>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-10 print:mt-0 print:px-0">
                {/* Physical Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 print:grid-cols-4 print:gap-2 print:mb-8"
                >
                    {[
                        { label: 'Edad', value: `${age} Años`, icon: Calendar },
                        { label: 'Altura', value: player.height ? `${player.height} cm` : '-', icon: Ruler },
                        { label: 'Peso', value: player.weight ? `${player.weight} kg` : '-', icon: Weight },
                        { label: 'Pie Hábil', value: player.foot === 'right' ? 'Diestro' : player.foot === 'left' ? 'Zurdo' : player.foot === 'both' ? 'Ambidextro' : '-', icon: Activity },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-[#39FF14]/30 transition-colors group print:bg-white print:border-gray-300 print:p-4 print:rounded-lg">
                            <stat.icon className="text-slate-500 mb-2 group-hover:text-[#39FF14] transition-colors print:text-black" size={24} />
                            <span className="text-2xl font-bold font-display text-white print:text-black">{stat.value}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold print:text-gray-600">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Custom Fields Grid */}
                {player.additionalInfo && player.additionalInfo.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 print:grid-cols-4 print:gap-2 print:mb-8"
                    >
                        {player.additionalInfo.map((info: any, i: number) => (
                            <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:border-[#39FF14]/20 transition-colors print:bg-white print:border-gray-200">
                                <span className="text-xl font-bold font-display text-white print:text-black">{info.value}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold print:text-gray-600">{info.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 print:block">
                    {/* Main Content - Stats */}
                    <div className="lg:col-span-2 space-y-12 print:space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-10 print:bg-white print:border-0 print:p-0 print-break-inside"
                        >
                            <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3 print:text-black print:mb-4">
                                <Activity className="text-[#39FF14] print:text-black" />
                                Análisis Técnico
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 print:grid-cols-2 print:gap-4">
                                <div className="space-y-6 print:space-y-4">
                                    <h4 className="text-white/50 text-sm font-bold uppercase border-b border-white/5 pb-2 print:text-black print:border-gray-300">Físico & Ritmo</h4>
                                    <AttributeSlider label="Velocidad" value={stats.speed || 0} />
                                    <AttributeSlider label="Físico" value={stats.physical || 0} color="#FF3939" />
                                </div>
                                <div className="space-y-6 print:space-y-4">
                                    <h4 className="text-white/50 text-sm font-bold uppercase border-b border-white/5 pb-2 print:text-black print:border-gray-300">Técnica</h4>
                                    <AttributeSlider label="Técnica" value={stats.technique || 0} color="#39DFFF" />
                                    <AttributeSlider label="Táctica" value={stats.tactical || 0} color="#FFD739" />
                                    <AttributeSlider label="Disparo" value={stats.shooting || 0} />
                                    <AttributeSlider label="Pase" value={stats.passing || 0} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Video Section - Hide in Print */}
                        {player.videoUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6 no-print"
                            >
                                <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                    <Play className="text-[#39FF14]" />
                                    Video Highlights
                                </h3>
                                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                                    {getVideoEmbed(player.videoUrl)}
                                </div>
                                {isDirectVideo(player.videoUrl) && (
                                    <div className="flex justify-end">
                                        <a
                                            href={player.videoUrl}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                        >
                                            <Play size={18} /> Descargar Video
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Agency Info */}
                    <div className="lg:col-span-1 print:mt-8 print-break-inside">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-8 print:static print:bg-white print:border print:border-gray-200 print:p-6"
                        >
                            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 print:text-gray-600">Representado por</h4>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-bold text-white print:bg-gray-100 print:text-black">
                                    {player.agent?.agencyName?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white print:text-black">{player.agent?.agencyName || 'Agencia'}</h3>
                                    <p className="text-slate-400 text-sm print:text-gray-600">Agencia Certificada</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors mb-3 no-print">
                                Contactar Agente
                            </button>
                            <button
                                onClick={handlePrint}
                                className="w-full py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors no-print"
                            >
                                Descargar PDF
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-sm print:text-black print:border-gray-300">
                <p>Powered by Agent Sport Platform</p>
            </div>
        </div>
    );
};

export default PublicPlayerProfile;
