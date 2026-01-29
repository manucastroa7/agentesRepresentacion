import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Play, Trophy, User, ArrowRight, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ShareButtons from '@/components/ShareButtons';
import MiniPitch from '@/components/soccer/MiniPitch';
import { API_BASE_URL } from '@/config/api';

const PublicPlayerProfile = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/public/players/${playerId}`);
                if (!response.ok) throw new Error('Jugador no encontrado');
                const json = await response.json();
                const data = json.data || json;
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

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Cargando perfil...</div>;
    if (error) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500">{error}</div>;
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

    const playerFullName = `${player.firstName} ${player.lastName}`;
    const pageTitle = `${playerFullName} - ${player.position} | Agent Sport`;
    const pageDescription = `Ficha técnica, video y estadísticas de ${playerFullName}.`;
    const profileUrl = window.location.href;

    // Helper for grid items
    const InfoItem = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
        <div className="flex flex-col border-l-2 border-[#39FF14]/30 pl-4 py-1">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{label}</span>
            <span className="text-white font-display font-bold text-lg md:text-xl leading-none">{value}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#39FF14] selection:text-black pb-24 print:pb-0 print:bg-white print:text-black">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={player.avatarUrl || 'https://via.placeholder.com/1200x630'} />
            </Helmet>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { margin: 0; size: A4; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .print-break-inside { break-inside: avoid; }
                    * { text-shadow: none !important; box-shadow: none !important; }
                }
            `}</style>

            {/* Header / Agency Bar (Top) */}
            <div className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center print:static print:bg-white print:border-b-2 print:border-black">
                <div className="flex items-center gap-4">
                    {player.agent?.logo && (
                        <img src={player.agent.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-white/10 print:border-black" />
                    )}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white print:text-black">{player.agent?.agencyName || 'AGENCIA DEPORTIVA'}</h2>
                        <a href={`mailto:${player.agent?.email}`} className="text-xs text-slate-400 hover:text-[#39FF14] transition-colors flex items-center gap-1 print:text-gray-600">
                            <Mail size={12} /> Contactar Representante
                        </a>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Professional Profile</span>
                    <span className="text-[#39FF14] print:hidden">•</span>
                    <span className="print:text-black">2025 Season</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[85vh] w-full overflow-hidden mt-[72px] print:mt-0 print:h-[40vh]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505] z-10 print:hidden" />
                <img
                    src={player.avatarUrl || 'https://via.placeholder.com/1920x1080'}
                    alt={playerFullName}
                    className="w-full h-full object-cover object-top opacity-90 print:object-contain print:opacity-100"
                />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 z-20 print:static print:text-center print:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-4 print:justify-center">
                            <span className="px-5 py-2 bg-[#39FF14] text-black text-sm font-bold uppercase tracking-widest rounded-full print:border print:border-black print:bg-transparent">
                                {Array.isArray(player.position) ? player.position[0] : player.position}
                            </span>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white font-medium print:text-black print:bg-transparent print:border-black">
                                <MapPin size={16} />
                                <span>{player.nationality}</span>
                            </div>
                        </div>

                        <h1 className="text-7xl md:text-9xl font-display font-black text-white leading-[0.9] tracking-tighter mb-4 print:text-5xl print:text-black">
                            {player.firstName} <br />
                            <span className="text-slate-500 print:text-black">{player.lastName}</span>
                        </h1>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-30 -mt-12 space-y-12 print:mt-8 print:px-8">

                {/* 1. FICHA TÉCNICA (Full Width) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl print:bg-white print:border-black print:p-4"
                >
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 print:border-black">
                        <h3 className="text-2xl font-display font-bold text-white print:text-black">Ficha Técnica</h3>
                        <div className="text-[#39FF14] print:hidden"><User /></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        <InfoItem label="Edad" value={`${age} Años`} />
                        <InfoItem label="Altura" value={player.height ? `${player.height} cm` : '-'} />
                        <InfoItem label="Peso" value={player.weight ? `${player.weight} kg` : '-'} />
                        <InfoItem label="Pie Hábil" value={player.foot === 'right' ? 'Diestro' : player.foot === 'left' ? 'Zurdo' : 'Ambidextro'} />
                        {player.passport && <InfoItem label="Pasaporte" value={player.passport} />}
                        {(player.club && player.club !== 'Agente Libre') && (
                            <InfoItem label="Club Actual" value={player.club} />
                        )}
                        {(player.marketValue && player.marketValue !== 'Consultar') && (
                            <InfoItem label="Valor Mercado" value={<span className="text-[#39FF14] print:text-black">{player.marketValue}</span>} />
                        )}
                    </div>

                    {/* Additional Info Row if exists */}
                    {player.additionalInfo && player.additionalInfo.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-white/5 border-dashed print:border-gray-300">
                            {player.additionalInfo
                                .filter((info: any) => info.isPublic !== false)
                                .map((info: any, i: number) => (
                                    <InfoItem key={i} label={info.label} value={info.value} />
                                ))}
                        </div>
                    )}
                </motion.div>

                {/* 2. SPLIT SECTION: TACTICAL (Left) | TRAJECTORY (Right) */}
                <div className={`grid grid-cols-1 ${player.careerHistory && player.careerHistory.length > 0 ? 'lg:grid-cols-2' : ''} gap-8`}>

                    {/* LEFT: Tactical Position */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 flex flex-col print:bg-white print:border-black print-break-inside"
                    >
                        <h3 className="text-2xl font-display font-bold text-white mb-2 print:text-black">Posicionamiento Táctico</h3>
                        <p className="text-slate-400 text-sm mb-8 print:text-gray-600">Distribución en el campo de juego.</p>

                        <div className="flex-1 flex items-center justify-center bg-black/50 rounded-3xl p-6 border border-white/5 print:bg-transparent print:border-0">
                            <div className="scale-110 print:scale-100">
                                <MiniPitch
                                    positions={Array.isArray(player.position) ? player.position : [player.position]}
                                    customPoints={player.tacticalPoints || []}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {Array.isArray(player.position) && player.position.map((pos: string) => (
                                <span key={pos} className="px-4 py-2 bg-white/5 rounded-full text-sm font-bold text-slate-300 border border-white/10 print:bg-slate-100 print:text-black print:border-black">
                                    {pos}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Trajectory */}
                    {player.careerHistory && player.careerHistory.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-white print:border-black print-break-inside"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white print:text-black">Trayectoria</h3>
                                    <p className="text-slate-400 text-sm print:text-gray-600">Historial de clubes y temporadas.</p>
                                </div>
                                <Trophy className="text-[#39FF14] print:text-black" />
                            </div>

                            <div className="space-y-4">
                                {player.careerHistory.map((item: any, idx: number) => (
                                    <div key={idx} className="group flex items-center gap-6 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-[#39FF14]/20 transition-all print:bg-white print:border-slate-300">
                                        <div className="w-16 h-16 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] font-black text-xl border border-[#39FF14]/10 print:bg-slate-100 print:text-black">
                                            {item.year}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white group-hover:text-[#39FF14] transition-colors print:text-black">{item.club}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <ArrowRight size={14} className="text-slate-500" />
                                                <span className="text-slate-400 text-sm print:text-gray-600">Temporada Oficial</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* 3. EXTENDED DETAILS (Contract, Health, Family, Observations) - Controlled by Visibility Toggles */}
                {(player.privateDetails?.contract?.isPublic || player.privateDetails?.health?.isPublic || player.privateDetails?.family?.isPublic || (typeof player.privateDetails?.observations === 'object' && player.privateDetails?.observations?.isPublic)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Contract Section */}
                        {player.privateDetails?.contract?.isPublic && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-white print:border-black print-break-inside"
                            >
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2 print:text-black">
                                    <span className="w-2 h-2 bg-[#39FF14] rounded-full"></span>
                                    Información Contractual
                                </h3>
                                <div className="space-y-4">
                                    <InfoItem label="Vencimiento" value={player.privateDetails.contract.expiryDate || '-'} />
                                    <InfoItem label="Cláusula de Salida" value={player.privateDetails.contract.releaseClause ? `$ ${player.privateDetails.contract.releaseClause}` : '-'} />
                                    <InfoItem label="Empresa Co-Representante" value={player.privateDetails.contract.coRepresented || '-'} />
                                    {/* Salary is usually too sensitive even for public, but if checked public, we show it? User asked for it. */}
                                    <InfoItem label="Salario Anual" value={player.privateDetails.contract.annualSalary ? `$ ${player.privateDetails.contract.annualSalary}` : '-'} />
                                </div>
                            </motion.div>
                        )}

                        {/* Health Section */}
                        {player.privateDetails?.health?.isPublic && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-white print:border-black print-break-inside"
                            >
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2 print:text-black">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Salud & Físico
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Historial de Lesiones</h4>
                                        <p className="text-white text-sm leading-relaxed print:text-black">{player.privateDetails.health.injuryHistory || 'Sin registros.'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Nutrición</h4>
                                        <p className="text-white text-sm leading-relaxed print:text-black">{player.privateDetails.health.nutrition || 'Sin registros.'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Family Section */}
                        {player.privateDetails?.family?.isPublic && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-white print:border-black print-break-inside"
                            >
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2 print:text-black">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Entorno & Familia
                                </h3>
                                <p className="text-white text-sm leading-relaxed print:text-black">
                                    {player.privateDetails.family.familyNotes || 'Sin información registrada.'}
                                </p>
                            </motion.div>
                        )}

                        {/* Observations Section */}
                        {typeof player.privateDetails?.observations === 'object' && player.privateDetails?.observations?.isPublic && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-white print:border-black print-break-inside"
                            >
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2 print:text-black">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                    Observaciones
                                </h3>
                                <p className="text-white text-sm leading-relaxed print:text-black">
                                    {player.privateDetails.observations.text || 'Sin observaciones.'}
                                </p>
                            </motion.div>
                        )}

                    </div>
                )}

                {/* 3. VIDEOS SECTION (Full Width) */}
                {(player.videoList?.length > 0 || player.videoUrl) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="no-print pt-8"
                    >
                        <h3 className="text-4xl font-display font-black text-white mb-8 flex items-center gap-4">
                            <span className="w-2 h-12 bg-[#39FF14] rounded-full block"></span>
                            Video Highlights
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Map videoList */}
                            {player.videoList?.map((video: any, idx: number) => (
                                <div key={idx} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl hover:border-[#39FF14]/50 transition-colors">
                                    {getVideoEmbed(video.url)}
                                    <div className="absolute top-4 left-4 pointer-events-none">
                                        {video.title && (
                                            <span className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg text-white font-bold text-sm border border-white/10">
                                                {video.title}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {/* Fallback legacy video */}
                            {(!player.videoList || player.videoList.length === 0) && player.videoUrl && (
                                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl relative group">
                                    {getVideoEmbed(player.videoUrl)}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

            </div>

            {/* Simple Footer */}
            <div className="max-w-[1400px] mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-sm print:text-black print:border-gray-300">
                <p>Powered by Agent Sport Platform</p>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 no-print">
                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
                    <button onClick={handlePrint} className="flex items-center gap-2 text-white hover:text-[#39FF14] transition-colors font-bold text-sm">
                        <span className="bg-white/10 p-2 rounded-full"><Calendar size={16} /></span>
                        <span>Descargar PDF</span>
                    </button>
                    <div className="w-px h-8 bg-white/10" />
                    <ShareButtons title={pageTitle} />
                </div>
            </div>

        </div>
    );
};

export default PublicPlayerProfile;
