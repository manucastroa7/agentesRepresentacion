import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    Trophy, CheckCircle, TrendingUp, Users, ArrowRight, Play,
    Layout, Share2, Zap, ChevronRight, Star, Instagram, Twitter, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/context/authStore';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

import PricingSection from './components/PricingSection';

const LandingPage = () => {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <div className="min-h-screen bg-tactical-grid font-sans text-white overflow-x-hidden selection:bg-[#39FF14] selection:text-black">
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <Trophy className="h-8 w-8 text-[#39FF14]" />
                        </Link>
                        <span className="text-2xl font-display font-bold tracking-tight italic text-white">AGENT <span className="text-[#39FF14]">SPORT</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-[#39FF14] transition-colors">Beneficios</a>
                        <a href="#how-it-works" className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-[#39FF14] transition-colors">Cómo Funciona</a>
                        <a href="#product" className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-[#39FF14] transition-colors">Producto</a>
                        <a href="#pricing" className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-[#39FF14] transition-colors">Precios</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button className="rounded-full bg-[#39FF14] hover:bg-[#32d612] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)] px-8 font-bold uppercase tracking-wide transition-all hover:scale-105">
                                    Ir al Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="rounded-full text-slate-300 hover:text-white hover:bg-white/10 font-bold">
                                        LOGIN
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button className="rounded-full bg-[#39FF14] hover:bg-[#32d612] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)] px-8 font-bold uppercase tracking-wide transition-all hover:scale-105">
                                        Solicitar Demo
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* SECTION 1: HERO */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Dark Stadium Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2000&auto=format&fit=crop"
                        alt="Stadium Night"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#39FF14]/10 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Column: Text */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_#39FF14]"></span>
                                <span className="text-xs font-bold text-[#39FF14] tracking-widest uppercase">Nueva Temporada 2025</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter italic">
                                TU PLANTEL,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-500">TU JUGADA.</span>
                            </h1>

                            <p className="text-xl text-slate-400 leading-relaxed max-w-lg font-medium">
                                La plataforma definitiva para gestionar y promocionar el talento de tu agencia. <span className="text-white">Visualiza, comparte y conecta.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                {isAuthenticated ? (
                                    <Link to="/dashboard">
                                        <Button size="lg" className="rounded-full w-full sm:w-auto text-lg h-14 px-10 bg-[#39FF14] hover:bg-[#32d612] text-black shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-transform hover:scale-105 font-black uppercase italic">
                                            Ir al Dashboard <ArrowRight className="ml-2 h-6 w-6" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/login">
                                            <Button size="lg" className="rounded-full w-full sm:w-auto text-lg h-14 px-10 bg-[#39FF14] hover:bg-[#32d612] text-black shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-transform hover:scale-105 font-black uppercase italic">
                                                Empezar Ahora <ArrowRight className="ml-2 h-6 w-6" />
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto text-lg h-14 px-10 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm font-bold uppercase tracking-wide">
                                            <Play className="mr-2 h-5 w-5 fill-current" /> Ver Demo
                                        </Button>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Right Column: Floating Mockup */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative perspective-1000"
                        >
                            <div className="relative z-20 transform hover:scale-[1.02] transition-transform duration-500">
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-[#39FF14]/20 rounded-[2rem] blur-2xl"></div>

                                <div className="glass-panel-dark p-2 rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl relative">
                                    <div className="bg-slate-950 rounded-[1.5rem] overflow-hidden border border-white/5 relative aspect-[16/10]">
                                        {/* Mockup Header */}
                                        <div className="h-12 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                            </div>
                                            <div className="h-2 w-20 bg-slate-800 rounded-full"></div>
                                        </div>

                                        {/* Mockup Content - Player Grid */}
                                        <div className="p-6 grid grid-cols-3 gap-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="bg-slate-900 rounded-xl border border-white/5 p-3 flex flex-col gap-3 group hover:border-[#39FF14]/50 transition-colors">
                                                    <div className="aspect-[3/4] bg-slate-800 rounded-lg relative overflow-hidden">
                                                        <img src={`https://images.unsplash.com/photo-${i === 1 ? '1517466787929-bc90951d0974' : i === 2 ? '1522770179533-24471fcdba45' : '1506794778202-cad84cf45f1d'}?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Player" />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                                                            <p className="text-[10px] font-bold text-[#39FF14]">9{i}</p>
                                                            <p className="text-[10px] font-bold text-white">JUGADOR {i}</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#39FF14] w-3/4"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: FEATURES */}
            <section id="features" className="py-24 bg-slate-950 relative border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 italic uppercase">
                            DOMINA EL <span className="text-[#39FF14]">MERCADO</span>
                        </h2>
                        <p className="text-slate-400 text-xl">Herramientas de élite para agencias que juegan en las grandes ligas.</p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Layout,
                                title: "VISIBILIDAD TOTAL",
                                description: "Tu plantel organizado como un equipo de primera división. Datos, multimedia y estadísticas en un solo dashboard.",
                            },
                            {
                                icon: Share2,
                                title: "PERFILES DIGITALES",
                                description: "Tus jugadores merecen una presentación de primer nivel. Olvida los PDFs y envía perfiles interactivos.",
                            },
                            {
                                icon: Zap,
                                title: "VELOCIDAD REAL",
                                description: "Sin intermediarios técnicos. Actualiza stats, sube videos y comparte perfiles en tiempo real.",
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-[#39FF14]/50 hover:bg-slate-900 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <feature.icon className="w-24 h-24 text-[#39FF14] -rotate-12" />
                                </div>
                                <div className="h-14 w-14 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14] mb-6 border border-[#39FF14]/20 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-3 italic">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3: HOW IT WORKS (TACTICS) */}
            <section id="how-it-works" className="py-24 bg-[#020617] relative overflow-hidden">
                {/* Tactical Board Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#39FF14 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-[#39FF14] font-bold tracking-widest uppercase text-sm mb-2 block">Estrategia de Juego</span>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white italic uppercase">TU PLAN DE PARTIDO</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "SCOUTING & ALTA", desc: "Carga tus jugadores al sistema en segundos." },
                            { step: "02", title: "TÁCTICA & PERFIL", desc: "Organiza la información visual y destaca sus mejores jugadas." },
                            { step: "03", title: "EL PASE FINAL", desc: "Comparte el link con directores deportivos al instante." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative group">
                                <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl hover:border-[#39FF14] transition-colors duration-300 h-full">
                                    <div className="text-6xl font-display font-black text-slate-800 absolute top-4 right-6 group-hover:text-[#39FF14]/10 transition-colors italic">
                                        {item.step}
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-display font-bold text-white mb-4 italic">{item.title}</h3>
                                        <p className="text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                {idx < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-800 z-20"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: PLAYER CARD VISUAL */}
            <section id="product" className="py-32 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/5 rounded-full blur-[120px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-5xl font-display font-black text-white mb-8 italic uppercase leading-none">
                                FICHAS NIVEL <br /><span className="text-[#39FF14]">CHAMPIONS</span>
                            </h2>
                            <p className="text-slate-400 text-xl mb-10 leading-relaxed font-medium">
                                Diseñamos cada tarjeta para que parezca sacada de un videojuego de élite. Stats claras, diseño agresivo y máxima legibilidad.
                            </p>
                            <ul className="space-y-6 mb-10">
                                {[
                                    "Diseño Mobile-First agresivo",
                                    "Highlights integrados",
                                    "Radar de habilidades dinámico",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white font-bold text-lg">
                                        <div className="w-6 h-6 rounded-full bg-[#39FF14] flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-black" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Button className="bg-white text-black hover:bg-slate-200 rounded-full font-black px-10 py-6 text-lg uppercase tracking-wide">
                                Ver Ejemplo Real <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        {/* FUT Card Style Simulation */}
                        <div className="relative mx-auto w-80 group cursor-pointer perspective-1000">
                            <div className="relative transform group-hover:rotate-y-12 transition-transform duration-500 preserve-3d">
                                {/* Card Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-b from-[#39FF14] to-emerald-600 rounded-[2rem] blur opacity-40 group-hover:opacity-70 transition-opacity"></div>

                                {/* The Card */}
                                <div className="relative bg-slate-900 rounded-[1.8rem] overflow-hidden border-2 border-[#39FF14]/30 shadow-2xl">
                                    {/* Top Background */}
                                    <div className="h-48 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-800 relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                                        <div className="absolute top-4 left-4">
                                            <p className="text-4xl font-display font-black text-[#39FF14] italic">94</p>
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">MCO</p>
                                        </div>
                                        <img
                                            src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop"
                                            alt="Player"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-56 object-cover drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] mask-image-gradient-to-b"
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className="p-6 pt-2 text-center relative z-10">
                                        <h3 className="text-3xl font-display font-black text-white uppercase italic mb-1">ALMADA</h3>
                                        <div className="flex justify-center gap-4 text-slate-400 text-xs font-bold uppercase mb-6 border-b border-white/10 pb-4">
                                            <span>Argentina</span>
                                            <span>•</span>
                                            <span>Atlanta Utd</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-center">
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Ritmo</p>
                                                <p className="text-2xl font-display font-black text-[#39FF14]">88</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Tiro</p>
                                                <p className="text-2xl font-display font-black text-[#39FF14]">85</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Pase</p>
                                                <p className="text-2xl font-display font-black text-[#39FF14]">91</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Regate</p>
                                                <p className="text-2xl font-display font-black text-[#39FF14]">94</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: PRICING */}
            <PricingSection />

            {/* SECTION 6: FOOTER */}
            <footer className="bg-black text-slate-400 py-16 border-t border-white/10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="h-6 w-6 text-[#39FF14]" />
                                <span className="text-xl font-display font-bold text-white italic">AGENT <span className="text-[#39FF14]">SPORT</span></span>
                            </div>
                            <p className="text-slate-500 max-w-xs mb-6 font-medium">
                                Potenciando la próxima generación de talentos. La herramienta definitiva para el fútbol moderno.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-slate-500 hover:text-[#39FF14] transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-slate-500 hover:text-[#39FF14] transition-colors"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="text-slate-500 hover:text-[#39FF14] transition-colors"><Linkedin className="w-5 h-5" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Plataforma</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li><a href="#" className="hover:text-[#39FF14] transition-colors">Beneficios</a></li>
                                <li><a href="#" className="hover:text-[#39FF14] transition-colors">Cómo Funciona</a></li>
                                <li><a href="#" className="hover:text-[#39FF14] transition-colors">Precios</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Legal</h4>
                            <ul className="space-y-3 text-sm font-medium">
                                <li><a href="#" className="hover:text-[#39FF14] transition-colors">Privacidad</a></li>
                                <li><a href="#" className="hover:text-[#39FF14] transition-colors">Términos</a></li>
                                <li><a href="#" className="hover:text-[#39FF14] transition-colors">Contacto</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-16 pt-8 text-center text-xs font-bold uppercase tracking-widest text-slate-600">
                        <p>&copy; 2025 Agent Sport. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
