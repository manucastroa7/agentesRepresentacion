import { motion } from 'framer-motion';
import { X, Check, Youtube, FileText, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProblemSolution = () => {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-blue-500 font-bold text-sm tracking-widest uppercase mb-4 block">DEL CAOS AL ORDEN</span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white italic tracking-tighter">
                        CENTRALIZA TU <span className="text-[#39FF14]">CARRERA</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">

                    {/* LEFT: THE CHAOS (Dispersed Information) */}
                    <div className="space-y-8 relative">
                        {/* Connecting Lines (Decorative) */}
                        <div className="absolute right-0 top-1/2 w-12 h-[2px] bg-gradient-to-r from-red-500/20 to-transparent hidden lg:block"></div>

                        <div className="bg-slate-900/50 p-8 rounded-3xl border border-red-500/10 relative overflow-hidden group hover:border-red-500/20 transition-all">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                ANTES
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-sm">✕</span>
                                Información Dispersa
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                                    <Youtube className="text-red-500 w-6 h-6" />
                                    <span className="text-slate-400 text-sm">Highlights en YouTube</span>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                                    <FileText className="text-slate-500 w-6 h-6" />
                                    <span className="text-slate-400 text-sm">CV en PDF Desactualizado</span>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                                    <Database className="text-green-600 w-6 h-6" />
                                    <span className="text-slate-400 text-sm">Stats en Excel/Webs</span>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2 opacity-50">
                                    <span className="text-2xl">Whatsapp</span>
                                    <span className="text-slate-400 text-sm">Fotos perdidas en chats</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: THE PRO SOLUTION (AgentSport) */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#39FF14]/10 blur-3xl rounded-full opacity-20"></div>

                        <div className="relative bg-slate-900 border border-[#39FF14]/50 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                            <div className="absolute top-0 right-0 bg-[#39FF14] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                AHORA
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center text-[#39FF14]"><Check size={16} strokeWidth={4} /></span>
                                Todo en un Solo Link
                            </h3>

                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Visual Representation of Centralization */}
                                <div className="relative w-32 shrink-0">
                                    <div className="border-[4px] border-slate-800 rounded-[2rem] h-64 bg-slate-950 relative overflow-hidden shadow-2xl">
                                        {/* Phone Screen UI Mockup */}
                                        <div className="w-full h-full bg-slate-900 flex flex-col items-center pt-4">
                                            <div className="w-12 h-12 bg-slate-800 rounded-full mb-2 border border-[#39FF14]/30"></div>
                                            <div className="w-20 h-2 bg-slate-800 rounded-full mb-1"></div>
                                            <div className="w-16 h-2 bg-slate-800 rounded-full mb-4"></div>

                                            {/* Grid of 'Content' */}
                                            <div className="w-full px-2 grid grid-cols-2 gap-1 opacity-50">
                                                <div className="h-16 bg-[#39FF14]/20 rounded-lg col-span-2"></div>
                                                <div className="h-12 bg-blue-500/20 rounded-lg"></div>
                                                <div className="h-12 bg-purple-500/20 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Badges pointing to phone */}
                                    <div className="absolute top-10 -right-4 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">Video</div>
                                    <div className="absolute bottom-12 -left-4 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">Stats</div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Tu <b className="text-white">highlights</b> de video,
                                        tu <b className="text-white">trayectoria</b>,
                                        tus <b className="text-white">datos físicos</b> y
                                        tu <b className="text-white">contacto</b>.
                                    </p>
                                    <p className="text-[#39FF14] font-display font-medium italic text-lg border-l-2 border-[#39FF14] pl-4">
                                        "Una carta de presentación que reúne toda la información y no está por todos lados."
                                    </p>
                                    <Button variant="link" className="text-white p-0 h-auto hover:text-[#39FF14] group">
                                        Ver ejemplo real <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
