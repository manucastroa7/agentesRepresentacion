import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Shield, Play, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import defaultAvatar from '@/assets/hero_player.png';

export interface PlayerMarketData {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    nationality: string;
    age: number;
    height?: number;
    weight?: number;
    foot?: string;
    club?: string;
    avatarUrl?: string;
    agencyName: string;
    agencyLogo?: string;
    videoUrl?: string;
    contractStatus?: string;
    marketValue?: string;
}

interface PlayerMarketCardProps {
    player: PlayerMarketData;
    onClick: () => void;
}

const PlayerMarketCard: React.FC<PlayerMarketCardProps> = ({ player, onClick }) => {
    const [imageError, setImageError] = useState(false);

    const getPositionColor = (pos: string) => {
        const p = pos.toLowerCase();
        if (p.includes('arquero') || p.includes('portero')) return 'bg-yellow-500/90 text-black';
        if (p.includes('defensa') || p.includes('defensor') || p.includes('lateral')) return 'bg-blue-600/90 text-white';
        if (p.includes('medio') || p.includes('volante')) return 'bg-green-600/90 text-white';
        if (p.includes('delantero') || p.includes('extremo')) return 'bg-red-600/90 text-white';
        return 'bg-slate-600/90 text-white';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer h-[420px] w-full shadow-xl border border-white/5 hover:border-[#39FF14]/50 transition-all duration-300"
            onClick={onClick}
        >
            {/* Background Image */}
            <div className="absolute inset-0 bg-slate-800">
                <motion.img
                    src={(!imageError && player.avatarUrl) ? player.avatarUrl : defaultAvatar}
                    alt={`${player.firstName} ${player.lastName}`}
                    className={`w-full h-full object-cover object-top ${(!imageError && player.avatarUrl) ? '' : 'opacity-80'}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    onError={() => setImageError(true)}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-transparent opacity-60" />
            </div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 gap-2">
                <Badge className={`${getPositionColor(player.position)} backdrop-blur-md border-none px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg max-w-[50%] truncate block`}>
                    {player.position}
                </Badge>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-xs font-bold text-white tracking-wider shadow-sm">
                        {player.nationality}
                    </div>
                    {player.marketValue && (
                        <div className="bg-[#39FF14]/90 text-black px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                            <DollarSign size={10} strokeWidth={3} />
                            {player.marketValue}
                        </div>
                    )}
                </div>
            </div>

            {/* Center Action (Hidden by default, appears on hover) */}
            {player.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 backdrop-blur-sm flex items-center justify-center border border-[#39FF14]/50 shadow-[0_0_30px_rgba(57,255,20,0.3)]">
                        <Play size={32} className="text-[#39FF14] ml-1" fill="currentColor" />
                    </div>
                </div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Name */}
                <h3 className="text-3xl font-display font-bold text-white leading-none mb-2 drop-shadow-lg">
                    {player.firstName}
                    <span className="block text-[#39FF14]">{player.lastName}</span>
                </h3>

                {/* Basic Info */}
                <div className="flex items-center gap-4 text-slate-300 text-sm mb-4 font-medium">
                    <span className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                        {player.age} años
                    </span>
                    {player.club && (
                        <span className="flex items-center gap-1.5 truncate min-w-0 flex-1" title={player.club}>
                            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">{player.club}</span>
                        </span>
                    )}
                </div>

                {/* Expanded Info (Agency & Status) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                    <div className="overflow-hidden">
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {player.agencyLogo ? (
                                        <img src={player.agencyLogo} alt={player.agencyName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Shield size={14} className="text-slate-500" />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider truncate">Agencia</span>
                                    <span className="text-xs font-bold text-white truncate">{player.agencyName}</span>
                                </div>
                            </div>

                            {player.contractStatus && (
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${player.contractStatus === 'Libre'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                    {player.contractStatus}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlayerMarketCard;
