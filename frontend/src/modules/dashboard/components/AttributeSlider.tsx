import React from 'react';

interface AttributeSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    color?: string;
}

const AttributeSlider: React.FC<AttributeSliderProps> = ({ label, value, onChange, color = '#39FF14' }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">{label}</span>
                <span className="text-white font-bold">{value}</span>
            </div>
            <div className="relative h-2 bg-slate-900 rounded-full">
                <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
                <input
                    type="range"
                    min="0"
                    max="99"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default AttributeSlider;
