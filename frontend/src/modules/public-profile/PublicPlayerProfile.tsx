import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trophy, User, Mail, PlayCircle } from 'lucide-react';
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

    // Helper to extract YouTube ID
    const getYoutubeId = (url?: string) => {
        if (!url) return null;
        try {
            const cleanUrl = url.trim();
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = cleanUrl.match(regExp);
            if (match && match[2].length >= 10) {
                return match[2];
            }
            return null;
        } catch (error) {
            console.error("Error parsing YouTube ID:", error);
            return null;
        }
    };

    // Priority: 1. Main videoUrl, 2. First video from videoList
    const rawVideoUrl = player.videoUrl || (player.videoList && player.videoList.length > 0 ? player.videoList[0].url : null);

    const videoId = getYoutubeId(rawVideoUrl);

    console.log('[PublicProfile] Player:', player.firstName, player.lastName);
    console.log('[PublicProfile] VideoUrl (Main):', player.videoUrl);
    console.log('[PublicProfile] VideoList:', player.videoList);
    console.log('[PublicProfile] Selected URL:', rawVideoUrl);
    console.log('[PublicProfile] Extracted ID:', videoId);

    // Combine main video and gallery videos
    const allVideos = [
        ...(player.videoUrl ? [player.videoUrl] : []),
        ...(player.videoList?.map((v: any) => v.url) || [])
    ];


    const handlePrint = () => {
        window.print();
    };

    const playerFullName = `${player.firstName} ${player.lastName}`;
    const pageTitle = `${playerFullName} - ${player.position} | Agent Sport`;
    const pageDescription = `Ficha técnica, video y estadísticas de ${playerFullName}.`;
    const profileUrl = window.location.href;


    // Helper for grid items
    const InfoItem = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
        <div className="flex flex-col border-l-2 border-[#39FF14]/30 pl-4 py-1 print:border-l-4 print:border-black">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1 print:text-gray-600 pointer-events-none">{label}</span>
            <span className="text-white font-display font-bold text-lg md:text-xl leading-none print:text-black">{value}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#39FF14] selection:text-black pb-24 print:pb-0 print:bg-white print:text-black print:min-h-0">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={player.avatarUrl || 'https://via.placeholder.com/1200x630'} />
            </Helmet>

            {/* Print Styles - One Page Optimization */}
            <style>{`
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .print-break-inside { break-inside: avoid; }
                    * { text-shadow: none !important; box-shadow: none !important; }
                    .print-compact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                    .print-full-width { grid-column: 1 / -1; }
                }
            `}</style>

            {/* Header / Agency Bar (Top) */}
            <div className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center print:static print:bg-transparent print:border-b-2 print:border-black print:px-0 print:py-2 print:mb-4">
                <div className="flex items-center gap-4">
                    {player.agent?.logo && (
                        <img src={player.agent.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-white/10 print:border-black print:w-12 print:h-12" />
                    )}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white print:text-black print:text-lg">{player.agent?.agencyName || 'AGENCIA DEPORTIVA'}</h2>
                        <a href={`mailto:${player.agent?.email}`} className="text-xs text-slate-400 hover:text-[#39FF14] transition-colors flex items-center gap-1 print:text-gray-600">
                            <Mail size={12} /> Contactar Representante
                        </a>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500 print:text-black print:flex">
                    <span>Professional Profile</span>
                    <span className="text-[#39FF14] print:hidden">•</span>
                    <span className="print:text-black">2025 Season</span>
                </div>
            </div>

            {/* Hero Section - Compact for Print */}
            <div className="relative h-[85vh] w-full overflow-hidden mt-[72px] print:mt-0 print:h-auto print:overflow-visible print:flex print:flex-row print:gap-8 print:mb-6 print:border-b print:border-gray-200 print:pb-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505] z-10 print:hidden" />

                {/* Print: Image on Left */}
                <div className="w-full h-full print:w-[200px] print:h-[200px] print:shrink-0">
                    <img
                        src={player.avatarUrl || 'https://via.placeholder.com/1920x1080'}
                        alt={playerFullName}
                        className="w-full h-full object-cover object-top opacity-90 print:object-cover print:opacity-100 print:rounded-xl print:border print:border-gray-300"
                    />
                </div>

                {/* Print: Info on Right */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 z-20 print:static print:p-0 print:flex flex-col justify-center print:text-left print:text-black">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="print:!opacity-100 print:!transform-none"
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-4 print:mb-2">
                            <span className="px-5 py-2 bg-[#39FF14] text-black text-sm font-bold uppercase tracking-widest rounded-full print:bg-black print:text-white print:px-3 print:py-1 print:text-xs">
                                {Array.isArray(player.position) ? player.position[0] : player.position}
                            </span>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white font-medium print:text-black print:bg-transparent print:border-0 print:p-0">
                                <MapPin size={16} />
                                <span>{player.nationality}</span>
                            </div>
                        </div>

                        <h1 className="text-7xl md:text-9xl font-display font-black text-white leading-[0.9] tracking-tighter mb-4 print:text-4xl print:text-black print:mb-0 print:leading-tight">
                            {player.firstName} <span className="text-slate-500 print:text-black">{player.lastName}</span>
                        </h1>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-30 -mt-12 space-y-12 print:mt-0 print:px-0 print:space-y-6">

                {/* 1. FICHA TÉCNICA (Compact) */}
                <motion.div
                    className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl print:bg-transparent print:border-0 print:p-0 print:shadow-none print:mb-4"
                >
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 print:border-gray-300 print:mb-4 print:pb-2">
                        <h3 className="text-2xl font-display font-bold text-white print:text-black print:text-xl">Ficha Técnica</h3>
                        <div className="text-[#39FF14] print:hidden"><User /></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 print:grid-cols-4 print:gap-4">
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

                    {/* Additional Info Row */}
                    {player.additionalInfo && player.additionalInfo.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-white/5 border-dashed print:border-gray-300 print:mt-4 print:pt-4 print:gap-4 print:grid-cols-4">
                            {player.additionalInfo
                                .filter((info: any) => info.isPublic !== false)
                                .map((info: any, i: number) => (
                                    <InfoItem key={i} label={info.label} value={info.value} />
                                ))}
                        </div>
                    )}
                </motion.div>

                {/* Print Layout: Multi-column grid for sections */}
                <div className="print:print-compact-grid">

                    {/* LEFT: Tactical Position */}
                    <motion.div
                        className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 flex flex-col print:bg-transparent print:border print:border-gray-200 print:p-4 print:rounded-xl print-break-inside"
                    >
                        <h3 className="text-2xl font-display font-bold text-white mb-2 print:text-black print:text-lg">Posicionamiento</h3>
                        <div className="flex-1 flex items-center justify-center bg-black/50 rounded-3xl p-6 border border-white/5 print:bg-transparent print:border-0 print:p-2">
                            <div className="scale-110 print:scale-75">
                                <MiniPitch
                                    positions={Array.isArray(player.position) ? player.position : [player.position]}
                                    customPoints={player.tacticalPoints || []}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-2 print:mt-2">
                            {Array.isArray(player.position) && player.position.map((pos: string) => (
                                <span key={pos} className="px-4 py-2 bg-white/5 rounded-full text-sm font-bold text-slate-300 border border-white/10 print:bg-gray-100 print:text-black print:border-black print:text-xs print:px-2 print:py-1">
                                    {pos}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT column in print */}
                    <div className="space-y-8 print:space-y-4">
                        {/* Trajectory */}
                        {player.careerHistory && player.careerHistory.length > 0 && (
                            <motion.div
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-transparent print:border print:border-gray-200 print:p-4 print:rounded-xl print-break-inside"
                            >
                                <div className="flex items-center justify-between mb-8 print:mb-4">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-white print:text-black print:text-lg">Trayectoria</h3>
                                    </div>
                                    <Trophy className="text-[#39FF14] print:hidden" />
                                </div>

                                <div className="space-y-4 print:space-y-2">
                                    {player.careerHistory.slice(0, 5).map((item: any, idx: number) => (
                                        <div key={idx} className="group flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-transparent hover:border-[#39FF14]/20 print:bg-transparent print:border-0 print:p-0 print:gap-4 print:border-b print:border-gray-100 print:pb-2 last:border-0">
                                            <div className="w-16 h-16 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] font-black text-xl border border-[#39FF14]/10 print:text-black print:bg-gray-100 print:w-10 print:h-10 print:text-sm print:border-0">
                                                {item.year}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-white print:text-black print:text-base">{item.club}</h4>
                                                <span className="text-slate-400 text-sm print:text-gray-600 print:text-xs">Temporada Oficial</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Private Details (Contract, Health, etc) */}
                        {(player.privateDetails?.contract?.isPublic || player.privateDetails?.health?.isPublic || player.privateDetails?.family?.isPublic || (typeof player.privateDetails?.observations === 'object' && player.privateDetails?.observations?.isPublic)) && (
                            <motion.div
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:bg-transparent print:border print:border-gray-200 print:p-4 print:rounded-xl print-break-inside"
                            >
                                <h3 className="text-2xl font-display font-bold text-white mb-6 print:text-black print:text-lg print:mb-4">Información Adicional</h3>

                                <div className="space-y-6 print:space-y-4">
                                    {player.privateDetails?.contract?.isPublic && (
                                        <div className="print-break-inside">
                                            <h4 className="text-sm uppercase font-bold text-slate-500 mb-2 print:text-black">Contractual</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InfoItem label="Vencimiento" value={player.privateDetails.contract.expiryDate || '-'} />
                                                <InfoItem label="Cláusula" value={player.privateDetails.contract.releaseClause ? `$ ${player.privateDetails.contract.releaseClause}` : '-'} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Grouping Health, Family, Obs into text blocks */}
                                    {player.privateDetails?.health?.isPublic && (
                                        <div className="print-break-inside">
                                            <h4 className="text-sm uppercase font-bold text-slate-500 mb-2 print:text-black">Salud</h4>
                                            <p className="text-white text-sm print:text-black text-justify">{player.privateDetails.health.injuryHistory || ''}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                </div>

                {/* VIDEO HIGHLIGHTS (Bottom) */}
                {allVideos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 print:hidden"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-display font-bold text-white">Video Highlights</h3>
                            <div className="text-[#39FF14]"><PlayCircle size={24} /></div>
                        </div>

                        <div className={`grid gap-6 ${allVideos.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {allVideos.map((url, index) => {
                                const vId = getYoutubeId(url);
                                if (!vId) return null;
                                return (
                                    <div key={index} className="aspect-video w-full relative group rounded-2xl overflow-hidden border border-white/5 bg-black">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${vId}?autoplay=0`}
                                            title={`Player Highlight ${index + 1}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Footer / Powered By */}
                <div className="max-w-[1400px] mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-sm print:text-gray-500 print:border-gray-300 print:mt-4 print:pt-2">
                    <p>Powered by Agent Sport Platform</p>
                    <p className="print:block hidden text-xs mt-1">{profileUrl}</p>
                </div>
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
