import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative bg-secondary overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-football-pattern opacity-10 pointer-events-none"></div>

            {/* Green Glow */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 pt-20 pb-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Plataforma #1 para Agentes FIFA
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
                            Potencia tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Agencia</span> <br />
                            al Siguiente Nivel
                        </h1>

                        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 font-light">
                            Gestiona jugadores, contratos y oportunidades en una sola plataforma.
                            Diseñada para la velocidad del mercado de pases moderno.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <a href="#demo-form" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                                Solicitar Demo
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg transition-all backdrop-blur-sm flex items-center justify-center">
                                Iniciar Sesión
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span>Sin tarjeta de crédito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span>Setup en 24hs</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Mockup */}
                    <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                        <div className="relative rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-2 backdrop-blur-md shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-700">
                            <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50"></div>
                                <div className="text-white/20 font-display text-4xl font-bold">Dashboard Preview</div>

                                {/* Floating Elements */}
                                <div className="absolute -top-6 -right-6 bg-card text-card-foreground p-4 rounded-lg shadow-xl border border-border animate-bounce duration-[3000ms]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                        <div>
                                            <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-2 w-16 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
