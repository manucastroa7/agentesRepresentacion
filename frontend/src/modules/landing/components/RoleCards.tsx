import { Link } from 'react-router-dom';
import { Briefcase, User, Building2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const RoleCards = () => {
    return (
        <section className="py-20 bg-slate-950 relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* CARD 1: AGENT */}
                    <Card className="bg-slate-900 border-t-4 border-t-blue-500 border-x-0 border-b-0 shadow-2xl hover:bg-slate-800/80 transition-all duration-300 flex flex-col h-full">
                        <CardHeader className="text-center pb-4 pt-10">
                            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                                <Briefcase size={32} />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">Para Agentes y Agencias</CardTitle>
                            <p className="text-blue-400 font-medium text-sm uppercase tracking-wider mt-2">Gestión Integral</p>
                        </CardHeader>
                        <CardContent className="flex-grow px-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Carga y gestiona tu plantilla completa de forma centralizada.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Comparte fichas técnicas y videos con un <span className="text-white font-medium">link profesional</span>.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Propone jugadores directamente a nuestra red de Clubes.</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-4">
                            <Link to="/register?role=agent" className="w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12">
                                    Profesionalizar mi Agencia
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* CARD 2: PLAYER */}
                    <Card className="bg-slate-900 border-t-4 border-t-[#39FF14] border-x-0 border-b-0 shadow-2xl hover:bg-slate-800/80 transition-all duration-300 flex flex-col h-full">
                        <CardHeader className="text-center pb-4 pt-10">
                            <div className="w-16 h-16 mx-auto bg-[#39FF14]/10 rounded-2xl flex items-center justify-center mb-6 text-[#39FF14]">
                                <User size={32} />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">Para Jugadores</CardTitle>
                            <p className="text-[#39FF14] font-medium text-sm uppercase tracking-wider mt-2">Visibilidad Total</p>
                        </CardHeader>
                        <CardContent className="flex-grow px-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Crea tu perfil multimedia con video highlights y datos verificados.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Muéstrate como <span className="text-white font-medium">Agente Libre</span> en el Mercado Digital.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Postúlate ante Representantes o Clubes de forma directa.</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-4">
                            <Link to="/register?role=player" className="w-full">
                                <Button className="w-full bg-[#39FF14] hover:bg-[#32d912] text-slate-950 font-bold h-12">
                                    Crear mi Perfil
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* CARD 3: CLUB */}
                    <Card className="bg-slate-900 border-t-4 border-t-indigo-500 border-x-0 border-b-0 shadow-2xl hover:bg-slate-800/80 transition-all duration-300 flex flex-col h-full">
                        <CardHeader className="text-center pb-4 pt-10">
                            <div className="w-16 h-16 mx-auto bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-500">
                                <Building2 size={32} />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">Para Clubes y Ligas</CardTitle>
                            <p className="text-indigo-400 font-medium text-sm uppercase tracking-wider mt-2">Scouting Inteligente</p>
                        </CardHeader>
                        <CardContent className="flex-grow px-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Acceso al "Market" global de jugadores Libres y Representados.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Filtra talento por <span className="text-white font-medium">posición, edad y presupuesto</span>.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">Contacta Agentes o Jugadores directos sin intermediarios.</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-4">
                            <Link to="/register?role=club" className="w-full">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12">
                                    Acceso Scouting
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </section>
    );
};

export default RoleCards;
