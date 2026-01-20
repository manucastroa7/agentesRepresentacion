import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, X, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const MarketFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Local state for immediate UI updates
    const [positions, setPositions] = useState<string[]>(searchParams.getAll('pos'));
    const [foot, setFoot] = useState(searchParams.get('foot') || '');
    const [ageRanges, setAgeRanges] = useState<string[]>(searchParams.getAll('age_range'));
    const [contractStatus, setContractStatus] = useState<string[]>(searchParams.getAll('status'));
    const [location, setLocation] = useState(searchParams.get('location') || '');

    // Debounced URL update
    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();

            positions.forEach(p => params.append('pos', p));
            if (foot) params.set('foot', foot);
            ageRanges.forEach(r => params.append('age_range', r));
            contractStatus.forEach(s => params.append('status', s));
            if (location && location !== 'all') params.set('location', location);

            setSearchParams(params);
        }, 500);

        return () => clearTimeout(timeout);
    }, [positions, foot, ageRanges, contractStatus, location, setSearchParams]);

    const togglePosition = (pos: string) => {
        setPositions(prev =>
            prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
        );
    };

    const toggleAgeRange = (rangeId: string) => {
        setAgeRanges(prev =>
            prev.includes(rangeId) ? prev.filter(r => r !== rangeId) : [...prev, rangeId]
        );
    };

    const toggleStatus = (status: string) => {
        setContractStatus(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const clearFilters = () => {
        setPositions([]);
        setFoot('');
        setAgeRanges([]);
        setContractStatus([]);
        setLocation('');
    };

    return (
        <aside className="w-full h-full bg-slate-900 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Filter size={20} className="text-[#39FF14]" />
                    Filtros
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <X size={12} /> Limpiar
                </button>
            </div>

            <div className="space-y-1">
                {/* Position Filter */}
                <FilterSection title="Posición" defaultOpen={true}>
                    {['Arquero', 'Defensor Central', 'Lateral', 'Volante', 'Extremo', 'Delantero'].map((pos) => (
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

                {/* Foot Filter */}
                <FilterSection title="Pie Hábil" defaultOpen={true}>
                    <RadioGroup value={foot} onValueChange={setFoot}>
                        {['Derecho', 'Izquierdo', 'Ambidiestro'].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                                <RadioGroupItem value={option} id={`foot-${option}`} className="border-slate-600 text-[#39FF14]" />
                                <Label htmlFor={`foot-${option}`} className="text-slate-300 cursor-pointer hover:text-white">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>

                {/* Age Filter */}
                <FilterSection title="Edad" defaultOpen={true}>
                    <div className="space-y-3">
                        {[
                            { id: 'sub-20', label: 'Sub-20 (< 20)', min: 0, max: 19 },
                            { id: '20-25', label: '20 - 25 años', min: 20, max: 25 },
                            { id: '26-30', label: '26 - 30 años', min: 26, max: 30 },
                            { id: '30-plus', label: '+30 años', min: 31, max: 100 }
                        ].map((range) => (
                            <div key={range.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`age-${range.id}`}
                                    checked={ageRanges.includes(range.id)}
                                    onCheckedChange={() => toggleAgeRange(range.id)}
                                    className="border-slate-600 data-[state=checked]:bg-[#39FF14] data-[state=checked]:text-black data-[state=checked]:border-[#39FF14]"
                                />
                                <Label htmlFor={`age-${range.id}`} className="text-slate-300 cursor-pointer hover:text-white">
                                    {range.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </FilterSection>

                {/* Contract Status Filter */}
                <FilterSection title="Estado" defaultOpen={true}>
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

                {/* Location Filter */}
                <FilterSection title="Ubicación">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">País / Provincia</Label>
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Argentina">Argentina</SelectItem>
                                <SelectItem value="Brasil">Brasil</SelectItem>
                                <SelectItem value="Uruguay">Uruguay</SelectItem>
                                <SelectItem value="Colombia">Colombia</SelectItem>
                                <SelectItem value="Europa">Europa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </FilterSection>
            </div>
        </aside>
    );
};

export default MarketFilters;
