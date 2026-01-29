import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import heroCoach from '@/assets/hero_coach.png';
import heroPlayer from '@/assets/hero_player.png';
import heroClub from '@/assets/hero_club.png';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#020617] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(57,255,20,0.05),rgba(255,255,255,0))]"></div>
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: TEXT */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left z-20 pl-6"
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[0.9] tracking-tighter self-start italic mb-8 uppercase drop-shadow-2xl">
                            TU FUTURO EMPIEZA CON UN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-500 whitespace-nowrap drop-shadow-sm filter">LINK.</span>
                        </h1>

                        <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed font-medium">
                            La plataforma que profesionaliza la <span className="text-white font-bold">carta de presentación</span> del futbolista.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register">
                                <Button size="lg" className="rounded-full h-14 px-8 bg-[#39FF14] hover:bg-[#32d612] text-slate-950 font-bold text-lg uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all hover:scale-105 active:scale-95">
                                    Crear mi Perfil Gratis <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: TILTED BARS COMPOSITION */}
                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex gap-4 md:gap-6 justify-center items-center transform -skew-x-12"
                        >
                            {/* Bar 1: Agent (Left) - Using Coach Image as per user reference */}
                            <div
                                className="relative w-28 md:w-44 h-80 md:h-[450px] rounded-2xl overflow-hidden border-2 border-[#39FF14]/50 hover:border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all duration-500 group bg-slate-900 bg-cover bg-center"
                                style={{ backgroundImage: `url(${heroCoach})` }}
                            >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                            </div>

                            {/* Bar 2: Player (Center - Tallest) */}
                            <div
                                className="relative w-32 md:w-52 h-96 md:h-[600px] rounded-2xl overflow-hidden border-2 border-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all duration-500 z-10 group mt-[-30px] bg-slate-900 bg-cover bg-center"
                                style={{ backgroundImage: `url(${heroPlayer})` }}
                            >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                            </div>

                            {/* Bar 3: Club (Right) - Using Business/Agent Image */}
                            <div
                                className="relative w-28 md:w-44 h-80 md:h-[450px] rounded-2xl overflow-hidden border-2 border-[#39FF14]/50 hover:border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all duration-500 group bg-slate-900 bg-cover bg-center"
                                style={{ backgroundImage: `url(${heroClub})` }}
                            >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
