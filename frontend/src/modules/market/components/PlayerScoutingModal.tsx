import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, Ruler, Weight, MapPin, Calendar, MessageCircle, Shield, Check, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlayerMarketData } from './PlayerMarketCard';

interface PlayerScoutingModalProps {
    player: PlayerMarketData | null;
    isOpen: boolean;
    onClose: () => void;
}

const PlayerScoutingModal: React.FC<PlayerScoutingModalProps> = ({ player, isOpen, onClose }) => {
    const [showContactInfo, setShowContactInfo] = useState(false);

    if (!player) return null;

    // Helper to extract YouTube ID
    const getYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(player.videoUrl);

    const handleContactClick = () => {
        setShowContactInfo(true);
    };

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
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Video Section (Top) - Fixed Height */}
                            <div className="w-full max-h-[40vh] aspect-video bg-black relative shrink-0 overflow-hidden">
                                {videoId ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                                        title="Player Highlights"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                                        <PlayCircle size={64} className="mb-4 opacity-50" />
                                        <p className="text-lg">Video Highlights no disponibles</p>
                                    </div>
                                )}

                                {/* Overlay Info on Video */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-6 pt-20">
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-1 drop-shadow-lg">
                                        {player.firstName} {player.lastName}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-[#39FF14] text-black font-bold px-3 py-1 rounded text-sm uppercase tracking-wider shadow-lg">
                                            {player.position}
                                        </span>
                                        <span className="text-white/90 text-lg font-light border-l border-white/30 pl-3 drop-shadow-md">
                                            {player.nationality}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-slate-900">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Left Column: Stats */}
                                    <div className="md:col-span-2 space-y-8">
                                        <div>
                                            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4 border-b border-white/10 pb-2">Ficha Técnica</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                                    <p className="text-xs text-slate-400 mb-1">Edad</p>
                                                    <p className="text-xl font-bold text-white">{player.age} <span className="text-xs font-normal text-slate-500">años</span></p>
                                                </div>
                                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                                    <p className="text-xs text-slate-400 mb-1">Altura</p>
                                                    <p className="text-xl font-bold text-white">{player.height || '-'} <span className="text-xs font-normal text-slate-500">cm</span></p>
                                                </div>
                                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                                    <p className="text-xs text-slate-400 mb-1">Peso</p>
                                                    <p className="text-xl font-bold text-white">{player.weight || '-'} <span className="text-xs font-normal text-slate-500">kg</span></p>
                                                </div>
                                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                                    <p className="text-xs text-slate-400 mb-1">Pie</p>
                                                    <p className="text-xl font-bold text-white capitalize">{player.foot || '-'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4 border-b border-white/10 pb-2">Trayectoria & Situación</h3>
                                            <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-400">Club Actual</p>
                                                            <p className="text-lg font-bold text-white">{player.club || 'Sin Club'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-slate-400">Estado</p>
                                                        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-medium mt-1">
                                                            {player.contractStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                                {player.marketValue && (
                                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                                        <span className="text-slate-400">Valor de Mercado (Est.)</span>
                                                        <span className="text-2xl font-bold text-[#39FF14]">{player.marketValue}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Agency & Contact */}
                                    <div className="space-y-6">
                                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                                            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">Representado por</h3>
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-20 h-20 rounded-full bg-white p-2 mb-3 overflow-hidden">
                                                    {player.agencyLogo ? (
                                                        <img src={player.agencyLogo} alt={player.agencyName} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                                            <Shield size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-1">{player.agencyName}</h4>
                                                <div className="flex items-center gap-1 text-[#39FF14] text-xs font-medium bg-[#39FF14]/10 px-2 py-1 rounded-full">
                                                    <Check size={12} /> Agencia Verificada
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Action Bar */}
                            <div className="p-6 bg-slate-900 border-t border-white/10 z-10">
                                {!showContactInfo ? (
                                    <Button
                                        onClick={handleContactClick}
                                        className="w-full h-14 bg-[#39FF14] hover:bg-[#32d612] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={24} />
                                        Contactar Representante
                                    </Button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <Button
                                            onClick={() => window.open(`https://wa.me/?text=Hola, interés en ${player.firstName}`, '_blank')}
                                            className="h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <Phone size={20} /> WhatsApp
                                        </Button>
                                        <Button
                                            onClick={() => window.location.href = `mailto:agent@example.com?subject=Interés en ${player.firstName}`}
                                            className="h-14 bg-white hover:bg-slate-200 text-slate-900 font-bold text-lg rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <Mail size={20} /> Email
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PlayerScoutingModal;
