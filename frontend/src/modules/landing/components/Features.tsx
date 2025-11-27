import { Users, Globe, Shield, Zap, BarChart3, Smartphone } from 'lucide-react';

const features = [
    {
        name: 'Gestión de Plantel',
        description: 'Base de datos completa de tus jugadores con estadísticas, contratos y multimedia.',
        icon: Users,
    },
    {
        name: 'Perfil Público',
        description: 'Genera sitios web profesionales para cada jugador con un solo clic.',
        icon: Globe,
    },
    {
        name: 'Seguridad Total',
        description: 'Tus datos protegidos con los más altos estándares de la industria.',
        icon: Shield,
    },
    {
        name: 'Actualizaciones en Tiempo Real',
        description: 'Sincronización instantánea de datos y notificaciones importantes.',
        icon: Zap,
    },
    {
        name: 'Métricas de Rendimiento',
        description: 'Analiza el crecimiento de tu agencia y el rendimiento de tus jugadores.',
        icon: BarChart3,
    },
    {
        name: 'Acceso Móvil',
        description: 'Gestiona tu agencia desde cualquier lugar con nuestra versión móvil optimizada.',
        icon: Smartphone,
    },
];

const Features = () => {
    return (
        <div className="py-24 bg-background relative overflow-hidden">
            {/* Diagonal Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Características</h2>
                    <p className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Todo lo que necesitas para triunfar
                    </p>
                    <p className="text-muted-foreground text-lg">
                        Herramientas diseñadas específicamente para la industria del fútbol moderno.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{feature.name}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
