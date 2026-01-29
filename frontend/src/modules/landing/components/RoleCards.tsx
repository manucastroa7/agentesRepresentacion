import { Link } from 'react-router-dom';
import { Briefcase, User, Building2, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoleCards = () => {
    return (
        <section className="py-20 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white italic tracking-tighter uppercase relative inline-block">
                        ¿CUÁL ES TU ROL EN LA <span className="text-[#39FF14]">CANCHA?</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card 1: Agents (Virtual Office - Highlighted) */}
                    <div className="bg-slate-900/80 rounded-2xl p-6 border border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] relative transform lg:-translate-y-4 flex flex-col h-full z-10 transition-colors group">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                            RECOMENDADO
                        </div>
                        <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6">
                            <Briefcase className="text-blue-600 h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Agentes y Academias</h3>
                        <p className="text-blue-500 font-bold text-xs tracking-wider uppercase mb-4">OFICINA VIRTUAL</p>
                        <p className="text-slate-300 text-sm flex-grow mb-6">
                            Ordena tu gestión y potencia la venta de tus jugadores con un portfolio profesional centralizado.
                        </p>
                        <Link to="/register?role=agent mt-auto">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                Crear Portfolio
                            </Button>
                        </Link>
                    </div>

                    {/* Card 2: Players (Automanagement) */}
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-[#39FF14] transition-colors group flex flex-col h-full">
                        <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center mb-6">
                            <User className="text-[#39FF14] h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Jugadores</h3>
                        <p className="text-[#39FF14] font-bold text-xs tracking-wider uppercase mb-4">AUTOGESTIÓN TOTAL</p>
                        <p className="text-slate-400 text-sm flex-grow mb-6">
                            Deja de ser un amateur en redes. Tu CV digital de primera división para compartir en Instagram.
                        </p>
                        <Link to="/register?role=player mt-auto">
                            <Button className="w-full bg-[#39FF14] hover:bg-[#32d612] text-black font-bold h-10 rounded-lg">
                                Crear Perfil Gratis
                            </Button>
                        </Link>
                    </div>

                    {/* Card 3: Parents (New - Security) */}
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-pink-500 transition-colors group flex flex-col h-full">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="text-pink-500 h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Padres y Familia</h3>
                        <p className="text-pink-500 font-bold text-xs tracking-wider uppercase mb-4">SEGURIDAD Y FUTURO</p>
                        <p className="text-slate-400 text-sm flex-grow mb-6">
                            La forma segura de darle visibilidad profesional al futuro de tus hijos ante el mercado.
                        </p>
                        <Link to="/register?role=parent mt-auto">
                            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-10 rounded-lg">
                                Empezar Ahora
                            </Button>
                        </Link>
                    </div>

                    {/* Card 4: Clubs (Coming Soon) */}
                    <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800 opacity-75 relative overflow-hidden flex flex-col h-full grayscale">
                        <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                            PRÓXIMAMENTE
                        </div>
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                            <Building2 className="text-slate-500 h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Clubes y Ligas</h3>
                        <p className="text-slate-500 font-bold text-xs tracking-wider uppercase mb-4">SCOUTING</p>
                        <p className="text-slate-500 text-sm flex-grow mb-6">
                            Acceso directo al mercado de talento global sin intermediarios.
                        </p>
                        <Button disabled className="w-full bg-slate-800 text-slate-500 font-bold h-10 rounded-lg cursor-not-allowed mt-auto">
                            Próximamente
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default RoleCards;
