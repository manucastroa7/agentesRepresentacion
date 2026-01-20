import React from 'react';
import { cn } from '@/lib/utils';

export type Position =
    | 'Portero'
    | 'Lateral derecho' | 'Central derecho' | 'Central izquierdo' | 'Lateral izquierdo'
    | 'Volante por derecha' | 'Volante central' | 'Volante izquierdo' | 'Enganche'
    | 'Extremo derecho' | 'Extremo izquierdo' | 'Media Punta' | 'Delantero Centro';

interface MiniPitchProps {
    positions: string[];
    interactive?: boolean;
    onPointClick?: (x: number, y: number) => void;
    customPoints?: Array<{ x: number, y: number }>;
    className?: string;
}

const POSITION_COORDS: Record<string, { x: number; y: number }> = {
    'Portero': { x: 50, y: 90 }, // Bottom center

    // Defenders
    'Lateral derecho': { x: 85, y: 75 },
    'Central derecho': { x: 65, y: 75 },
    'Central izquierdo': { x: 35, y: 75 },
    'Lateral izquierdo': { x: 15, y: 75 },

    // Midfielders
    'Volante por derecha': { x: 85, y: 50 },
    'Volante central': { x: 50, y: 55 },
    'Volante izquierdo': { x: 15, y: 50 },
    'Enganche': { x: 50, y: 40 },

    // Forwards
    'Extremo derecho': { x: 85, y: 25 },
    'Media Punta': { x: 50, y: 25 }, // Secondary Striker
    'Extremo izquierdo': { x: 15, y: 25 },
    'Delantero Centro': { x: 50, y: 15 }, // Top center
};

const MiniPitch = ({ positions = [], interactive = false, onPointClick, customPoints = [], className }: MiniPitchProps) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive || !onPointClick) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        onPointClick(x, y);
    };

    return (
        <div
            className={cn(`relative w-48 h-64 bg-[#2a8f36] rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl select-none ${interactive ? 'cursor-crosshair active:scale-95 transition-transform' : ''}`, className)}
            onClick={handleClick}
        >
            {/* Field Markings */}
            <div className="absolute inset-2 border-2 border-white/30 rounded-lg pointer-events-none" />
            {/* Center Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2" />
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />

            {/* Penalty Areas */}
            <div className="absolute top-0 left-1/2 w-3/5 h-1/6 border-b border-x border-white/20 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-3/5 h-1/6 border-t border-x border-white/20 -translate-x-1/2" />

            {/* Goal Areas */}
            <div className="absolute top-0 left-1/2 w-1/3 h-[6%] border-b border-x border-white/20 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1/3 h-[6%] border-t border-x border-white/20 -translate-x-1/2" />

            {/* Active Positions Dots (Standard) */}
            {Object.entries(POSITION_COORDS).map(([pos, coords]) => {
                // If we have custom points, we might chose NOT to show these, or show them ghosted.
                // For now, let's show them if they are in the 'positions' text array AND we have no custom points,
                // OR we can decide purely based on props.
                // Strategy: If customPoints exist, SHOW ONLY customPoints. If not, show standard dots.
                if (customPoints.length > 0) return null;

                const isActive = positions.includes(pos);
                return (
                    <div
                        key={pos}
                        className={cn(
                            "absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none",
                            isActive
                                ? "bg-[#39FF14] shadow-[0_0_10px_#39FF14] scale-125 z-10"
                                : "bg-white/20 scale-75"
                        )}
                        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                        title={pos}
                    />
                );
            })}

            {/* Custom Interactive Points */}
            {customPoints.map((point, index) => (
                <div
                    key={index}
                    className="absolute w-4 h-4 bg-[#39FF14] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#39FF14] z-20 pointer-events-none animate-pulse border-2 border-black/20"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                />
            ))}
        </div>
    );
};

export default MiniPitch;
