import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider'; // Assuming this exists or I'll use a custom one if it fails, but I saw it in the list? No I didn't see slider.tsx in the list. I'll use inputs for now or a custom slider.
// Wait, I didn't see slider.tsx. I'll implement a simple custom slider or use inputs.
// Actually, for "Senior Frontend Developer" look, I should try to make it look good.
// I'll use standard inputs for Min/Max age for reliability and speed, but style them well.

// Custom Accordion Item
const FilterSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-white/10 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{title}</span>
                <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 pb-2 space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // State for filters (sync with URL)
    const [positions, setPositions] = useState<string[]>(searchParams.getAll('pos'));
    const [minAge, setMinAge] = useState(searchParams.get('age_min') || '');
    const [maxAge, setMaxAge] = useState(searchParams.get('age_max') || '');
    const [foot, setFoot] = useState(searchParams.get('foot') || '');
    const [contractStatus, setContractStatus] = useState<string[]>(searchParams.getAll('status'));

    // Update URL when filters change
    const updateFilters = () => {
        const params = new URLSearchParams();
        positions.forEach(p => params.append('pos', p));
        if (minAge) params.set('age_min', minAge);
        if (maxAge) params.set('age_max', maxAge);
        if (foot) params.set('foot', foot);
        contractStatus.forEach(s => params.append('status', s));
        setSearchParams(params);
    };

    // Apply filters effect (debounce could be added here)
    useEffect(() => {
        const timeout = setTimeout(updateFilters, 500);
        return () => clearTimeout(timeout);
    }, [positions, minAge, maxAge, foot, contractStatus]);

    const togglePosition = (pos: string) => {
        setPositions(prev =>
            prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
        );
    };

    const toggleStatus = (status: string) => {
        setContractStatus(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const clearFilters = () => {
        setPositions([]);
        setMinAge('');
        setMaxAge('');
        setFoot('');
        setContractStatus([]);
        setSearchParams(new URLSearchParams());
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 bg-slate-900 border-r border-white/5 h-full min-h-screen p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Filter size={20} className="text-[#39FF14]" />
                    Filtros
                </h2>
                {(positions.length > 0 || minAge || maxAge || foot || contractStatus.length > 0) && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                        <X size={12} /> Limpiar
                    </button>
                )}
            </div>

            <div className="space-y-1">
                {/* Position Filter */}
                <FilterSection title="Posición" defaultOpen={true}>
                    {['Arquero', 'Defensor', 'Mediocampista', 'Delantero'].map((pos) => (
                        <div key={pos} className="flex items-center space-x-3">
                            <Checkbox
                                id={`pos-${pos}`}
                                checked={positions.includes(pos)}
                                onCheckedChange={() => togglePosition(pos)}
                                className="border-slate-600 data-[state=checked]:bg-[#39FF14] data-[state=checked]:text-black data-[state=checked]:border-[#39FF14]"
                            />
                            <Label htmlFor={`pos-${pos}`} className="text-slate-300 cursor-pointer hover:text-white">
                                {pos}
                            </Label>
                        </div>
                    ))}
                </FilterSection>

                {/* Age Filter */}
                <FilterSection title="Edad" defaultOpen={true}>
                    <div className="flex items-center gap-4">
                        <div className="space-y-1 flex-1">
                            <Label className="text-xs text-slate-500">Mínima</Label>
                            <input
                                type="number"
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                                placeholder="16"
                            />
                        </div>
                        <div className="space-y-1 flex-1">
                            <Label className="text-xs text-slate-500">Máxima</Label>
                            <input
                                type="number"
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                                placeholder="40"
                            />
                        </div>
                    </div>
                </FilterSection>

                {/* Foot Filter */}
                <FilterSection title="Pie Hábil">
                    <div className="space-y-2">
                        {['Derecho', 'Izquierdo', 'Ambos'].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                                <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${foot === option ? 'border-[#39FF14]' : 'border-slate-600'}`}
                                    onClick={() => setFoot(foot === option ? '' : option)}
                                >
                                    {foot === option && <div className="w-2 h-2 rounded-full bg-[#39FF14]" />}
                                </div>
                                <Label className="text-slate-300 cursor-pointer hover:text-white" onClick={() => setFoot(foot === option ? '' : option)}>
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                </FilterSection>

                {/* Contract Status Filter */}
                <FilterSection title="Estado Contractual" defaultOpen={true}>
                    {['Libre', 'Con Contrato', 'Prestamo'].map((status) => (
                        <div key={status} className="flex items-center space-x-3">
                            <Checkbox
                                id={`status-${status}`}
                                checked={contractStatus.includes(status)}
                                onCheckedChange={() => toggleStatus(status)}
                                className="border-slate-600 data-[state=checked]:bg-[#39FF14] data-[state=checked]:text-black data-[state=checked]:border-[#39FF14]"
                            />
                            <Label htmlFor={`status-${status}`} className="text-slate-300 cursor-pointer hover:text-white">
                                {status}
                            </Label>
                        </div>
                    ))}
                </FilterSection>
            </div>
        </aside>
    );
};

export default FilterSidebar;
