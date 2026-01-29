import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, Ruler, Weight, MapPin, Calendar, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlayerMarketData } from './PlayerMarketCard';

interface PlayerDetailModalProps {
    player: PlayerMarketData | null;
    isOpen: boolean;
    onClose: () => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, isOpen, onClose }) => {
    if (!player) return null;

    // Helper to extract YouTube ID
    const getYoutubeId = (url?: string) => {
        if (!url) return null;
        try {
            // Trim whitespace
            const cleanUrl = url.trim();

            // Regex for various YouTube URL formats
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = cleanUrl.match(regExp);

            // Return the ID if found (usually match[2])
            // We removed the strict length === 11 check to be more permissive, 
            // but typical IDs are 11 chars. We'll check for reasonable length (e.g. at least 10)
            if (match && match[2].length >= 10) {
                return match[2];
            }
            return null;
        } catch (error) {
            console.error("Error parsing YouTube ID:", error);
            return null;
        }
    };

    const videoId = getYoutubeId(player.videoUrl);
    console.log('[PlayerDetailModal] Video URL:', player.videoUrl);
    console.log('[PlayerDetailModal] Extracted ID:', videoId);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-white/10 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white">
                                    {player.firstName} {player.lastName}
                                </h2>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <span className="text-[#39FF14] font-semibold">{player.position}</span>
                                    <span>•</span>
                                    <span>{player.nationality}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Video Section */}
                            <div className="aspect-video w-full bg-black relative group">
                                {videoId ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                                        title="Player Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                                        <PlayCircle size={48} className="mb-2 opacity-50" />
                                        <p>Video no disponible</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Stats Grid */}
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">Ficha Técnica</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <Calendar className="text-[#39FF14] mb-2" size={20} />
                                            <p className="text-2xl font-bold text-white">{player.age}</p>
                                            <p className="text-xs text-slate-400">Edad</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <Ruler className="text-[#39FF14] mb-2" size={20} />
                                            <p className="text-2xl font-bold text-white">{player.height || '-'}</p>
                                            <p className="text-xs text-slate-400">Altura (cm)</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <Weight className="text-[#39FF14] mb-2" size={20} />
                                            <p className="text-2xl font-bold text-white">{player.weight || '-'}</p>
                                            <p className="text-xs text-slate-400">Peso (kg)</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <div className="text-[#39FF14] mb-2 font-bold text-lg">
                                                {player.foot === 'Derecho' ? 'R' : player.foot === 'Izquierdo' ? 'L' : '-'}
                                            </div>
                                            <p className="text-2xl font-bold text-white capitalize">{player.foot || '-'}</p>
                                            <p className="text-xs text-slate-400">Pie Hábil</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Club & Status */}
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">Situación Actual</h3>
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                                    <MapPin className="text-white" size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-400">Club Actual</p>
                                                    <p className="text-white font-semibold">{player.club || 'Sin Club'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-400">Contrato</p>
                                                <p className="text-[#39FF14] font-semibold">{player.contractStatus || 'Consultar'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Agency Info */}
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">Representación</h3>
                                    <div className="flex items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-xl border border-white/10">
                                        <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden border-2 border-white/10">
                                            {player.agencyLogo ? (
                                                <img src={player.agencyLogo} alt={player.agencyName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <Shield size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{player.agencyName}</p>
                                            <p className="text-xs text-slate-400">Agencia Verificada</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer Action */}
                        <div className="p-6 border-t border-white/10 bg-slate-900 sticky bottom-0 z-20">
                            <Button
                                className="w-full bg-[#39FF14] hover:bg-[#32d612] text-black font-bold text-lg h-14 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center justify-center gap-2"
                                onClick={() => {
                                    // In a real app, this would open a chat or email
                                    window.open(`https://wa.me/?text=Hola, estoy interesado en el jugador ${player.firstName} ${player.lastName}`, '_blank');
                                }}
                            >
                                <MessageCircle size={24} />
                                Contactar Representante
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PlayerDetailModal;
