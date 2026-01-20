import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, MapPin, Edit2, Shield, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import MiniPitch from '@/components/soccer/MiniPitch';

interface PlayerPreviewModalProps {
    player: any;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (id: string) => void;
}

const PlayerPreviewModal: React.FC<PlayerPreviewModalProps> = ({ player, isOpen, onClose, onEdit }) => {
    if (!player) return null;

    // Helper to extract YouTube ID
    const getYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(player.videoUrl);

    const calculateAge = (dateString?: string) => {
        if (!dateString) return '-';
        const ageDifMs = Date.now() - new Date(dateString).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

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

                            {/* Header / Banner */}
                            <div className="w-full h-48 bg-slate-800 relative shrink-0 overflow-hidden">
                                {player.avatarUrl ? (
                                    <>
                                        <img
                                            src={player.avatarUrl}
                                            alt={player.firstName}
                                            className="w-full h-full object-cover opacity-60"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <PlayCircle size={64} className="text-slate-700" />
                                    </div>
                                )}

                                <div className="absolute bottom-6 left-8">
                                    <h2 className="text-4xl font-display font-bold text-white mb-2">
                                        {player.firstName} <span className="text-[#39FF14]">{player.lastName}</span>
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-[#39FF14] text-black font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">
                                            {Array.isArray(player.position) ? player.position.join(', ') : player.position}
                                        </span>
                                        <span className="text-white/90 text-sm font-medium border-l border-white/30 pl-3 flex items-center gap-1">
                                            <MapPin size={14} /> {player.nationality}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-900">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                    {/* Left: Stats & Info */}
                                    <div className="md:col-span-2 space-y-8">
                                        {/* Physical Stats */}
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center">
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Edad</p>
                                                <p className="text-xl font-bold text-white">{calculateAge(player.birthDate)}</p>
                                            </div>
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center">
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Altura</p>
                                                <p className="text-xl font-bold text-white">{player.height || '-'} <span className="text-xs text-slate-500">cm</span></p>
                                            </div>
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center">
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Peso</p>
                                                <p className="text-xl font-bold text-white">{player.weight || '-'} <span className="text-xs text-slate-500">kg</span></p>
                                            </div>
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center">
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Pie</p>
                                                <p className="text-xl font-bold text-white capitalize">{player.foot || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Status & Contract */}
                                        <div className="bg-slate-800/30 rounded-xl p-6 border border-white/5">
                                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                                <Shield size={16} className="text-[#39FF14]" /> Situación Contractual
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Club Actual</p>
                                                    <p className="text-lg font-bold text-white">{player.club || 'Sin Club Asignado'}</p>
                                                </div>
                                                <Badge variant="outline" className={`${player.contractStatus === 'Libre'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    } text-sm px-3 py-1`}>
                                                    {player.contractStatus}
                                                </Badge>
                                            </div>
                                            {player.marketValue && (
                                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <span className="text-sm text-slate-400">Valor de Mercado</span>
                                                    <span className="text-xl font-bold text-[#39FF14] flex items-center gap-1">
                                                        <DollarSign size={16} /> {player.marketValue}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Video Preview */}
                                        {videoId && (
                                            <div>
                                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                                    <PlayCircle size={16} className="text-[#39FF14]" /> Video Highlights
                                                </h3>
                                                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title="Player Highlights"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Pitch & Actions */}
                                    <div className="space-y-6">
                                        <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 flex flex-col items-center">
                                            <MiniPitch
                                                positions={Array.isArray(player.position) ? player.position : [player.position]}
                                                customPoints={player.tacticalPoints || []}
                                            />
                                        </div>

                                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-300">Visible en Mercado</span>
                                                <Switch checked={player.isMarketplaceVisible} disabled />
                                            </div>

                                            <Button
                                                onClick={() => {
                                                    onClose();
                                                    onEdit(player.id);
                                                }}
                                                className="w-full bg-[#39FF14] hover:bg-[#32d612] text-black font-bold gap-2"
                                            >
                                                <Edit2 size={16} /> Editar Perfil Completo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PlayerPreviewModal;
