import { motion } from 'framer-motion';
import { UserPlus, FileCheck, Handshake } from 'lucide-react';

const Features = () => {
    return (
        <section id="trust-flow" className="py-24 bg-slate-950/50 relative border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 italic uppercase tracking-tighter">
                        EL FLUJO DE <span className="text-[#39FF14]">CONFIANZA</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Un sistema diseñado para profesionalizar cada etapa del mercado.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[20%] left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-[#39FF14]/30 to-slate-900 -z-10 transform -translate-y-1/2"></div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: UserPlus,
                                title: "POSTULACIÓN",
                                desc: "El jugador se postula a una Agencia Verificada, enviando su material y datos técnicos.",
                                highlight: false
                            },
                            {
                                icon: FileCheck,
                                title: "VALIDACIÓN Y PORTFOLIO",
                                desc: "La Agencia revisa, valida el talento y prepara el Portfolio Profesional para el mercado.",
                                highlight: true
                            },
                            {
                                icon: Handshake,
                                title: "CONEXIÓN REAL",
                                desc: "Los Clubes contactan directamente a la Agencia para iniciar negociaciones seguras.",
                                highlight: false
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className={`relative bg-slate-900 border ${item.highlight ? 'border-[#39FF14]/50' : 'border-white/10'} p-8 rounded-2xl hover:border-[#39FF14]/50 transition-colors group text-center shadow-lg`}
                            >
                                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:bg-[#39FF14]/10 group-hover:text-[#39FF14] transition-colors text-slate-400">
                                    <item.icon size={32} />
                                </div>
                                <h3 className={`text-xl font-display font-bold text-white mb-4 italic uppercase ${item.highlight ? 'text-[#39FF14]' : ''}`}>{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {item.desc}
                                </p>

                                {/* Step Number Badge */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#39FF14] text-black font-bold flex items-center justify-center text-xs shadow-lg shadow-[#39FF14]/20 ring-4 ring-slate-950">
                                    {idx + 1}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
