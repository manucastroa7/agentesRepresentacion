import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "INICIAL",
            priceMonthly: 35000,
            priceAnnual: 350000,
            target: "Scouts e Intermediarios",
            features: [
                "Gestión de hasta 10 Jugadores",
                "Perfil Público Básico",
                "Videos de YouTube",
                "Soporte por Email"
            ],
            notIncluded: [
                "Subida de Video HD (Cloudinary)",
                "Marca Blanca",
                "Dominio Propio"
            ],
            cta: "Empezar Prueba",
            popular: false,
            color: "slate"
        },
        {
            name: "PRO",
            priceMonthly: 95000,
            priceAnnual: 950000,
            target: "Agentes FIFA Activos",
            features: [
                "Hasta 50 Jugadores",
                "Perfiles Marca Blanca",
                "Subida de Video HD y Fotos (Cloudinary)",
                "Scouting Ilimitado (Kanban)",
                "Prioridad en Soporte",
                "Exportación a PDF"
            ],
            notIncluded: [
                "Dominio Propio"
            ],
            cta: "Prueba Gratis 14 días",
            popular: true,
            color: "neon"
        }
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 italic uppercase">
                        PLANES A LA MEDIDA DE TU <span className="text-[#39FF14]">CRECIMIENTO</span>
                    </h2>
                    <p className="text-slate-400 text-xl mb-8">
                        Precios en Pesos Argentinos. Hacemos Factura A.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold uppercase tracking-wider ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensual</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-16 h-8 bg-slate-900 rounded-full border border-white/10 relative transition-colors hover:border-[#39FF14]/50"
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-[#39FF14] rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-8' : ''}`}></div>
                        </button>
                        <span className={`text-sm font-bold uppercase tracking-wider ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                            Anual <span className="text-[#39FF14] text-xs ml-1">(Congelá el precio + 2 meses OFF)</span>
                        </span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                                relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 group
                                ${plan.popular
                                    ? 'bg-slate-900/80 border-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.15)] scale-105 z-10'
                                    : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'}
                            `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#39FF14] text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    Más Elegido
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-xl font-display font-black italic uppercase mb-2 ${plan.popular ? 'text-[#39FF14]' : 'text-white'}`}>
                                    {plan.name}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium mb-6">{plan.target}</p>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-display font-bold text-white">
                                        {isAnnual ? formatPrice(plan.priceAnnual) : formatPrice(plan.priceMonthly)}
                                    </span>
                                    <span className="text-slate-500 font-medium text-sm">
                                        {isAnnual ? '/ año' : '/ mes'}
                                    </span>
                                </div>
                                {isAnnual && (
                                    <p className="text-[#39FF14] text-xs font-bold mt-2">
                                        Ahorrás {formatPrice(plan.priceMonthly * 2)}
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-[#39FF14]' : 'text-slate-500'}`} />
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium line-through decoration-slate-700">
                                        <X className="w-5 h-5 shrink-0 text-slate-700" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`
                                    w-full py-6 rounded-xl font-bold uppercase tracking-wide text-sm transition-all
                                    ${plan.popular
                                        ? 'bg-[#39FF14] hover:bg-[#32d612] text-black shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]'
                                        : plan.color === 'white'
                                            ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black'
                                            : 'bg-slate-800 hover:bg-slate-700 text-white'}
                                `}
                            >
                                {plan.cta}
                            </Button>

                            <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-wider mt-4">
                                + IVA si corresponde
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
