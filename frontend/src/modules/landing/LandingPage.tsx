import { Link } from 'react-router-dom';
import { Trophy, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/context/authStore';

// Components
import Hero from './components/Hero';
import RoleCards from './components/RoleCards';
import Features from './components/Features';
// import PricingSection from './components/PricingSection';

const LandingPage = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-white overflow-x-hidden selection:bg-[#39FF14] selection:text-black">
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/90 backdrop-blur-md">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 group">
                            <Trophy className="h-8 w-8 text-[#39FF14] group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-display font-bold tracking-tight italic text-white">AGENT <span className="text-[#39FF14]">SPORT</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button className="rounded-full bg-[#39FF14] hover:bg-[#32d612] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)] px-6 font-bold uppercase tracking-wide transition-all hover:scale-105">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 font-bold px-6">
                                    <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* SECTIONS */}
            <Hero />

            <RoleCards />

            <Features />

            {/* Pricing (Optional, kept from previous iteration if needed) */}
            {/* <PricingSection /> */}

            {/* FOOTER */}
            <footer className="bg-black text-slate-400 py-12 border-t border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Trophy className="h-6 w-6 text-[#39FF14]" />
                        <span className="text-xl font-display font-bold text-white italic">AGENT <span className="text-[#39FF14]">SPORT</span></span>
                    </div>
                    <p className="text-sm font-medium mb-8 max-w-md mx-auto">
                        Conectando el ecosistema del fútbol profesional. Jugadores. Agentes. Clubes.
                    </p>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
                        &copy; 2025 Agent Sport. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
