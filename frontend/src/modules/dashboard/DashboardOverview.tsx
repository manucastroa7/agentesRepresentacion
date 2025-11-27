import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const stats = [
    { name: 'Jugadores Totales', value: '24', icon: Users, change: '+2 este mes', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Valor de Mercado', value: '€12.5M', icon: TrendingUp, change: '+5.2%', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Comisiones (YTD)', value: '€850k', icon: DollarSign, change: '+12%', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Contratos por Vencer', value: '3', icon: Activity, change: 'En 6 meses', color: 'text-red-500', bg: 'bg-red-500/10' },
];

const DashboardOverview = () => {
    const { toast } = useToast();

    const handleFeatureClick = (feature: string) => {
        toast({
            title: "Próximamente",
            description: `El gráfico de ${feature} estará disponible en una futura actualización.`,
        });
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Resumen General</h1>
                <p className="text-muted-foreground mt-2">Bienvenido de nuevo. Aquí está lo que sucede en tu agencia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-muted-foreground text-sm font-medium">{stat.name}</h3>
                        <p className="text-2xl font-bold text-foreground mt-1 font-display">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for Charts */}
                <div
                    onClick={() => handleFeatureClick("Valor de Mercado")}
                    className="bg-card p-6 rounded-xl border border-border shadow-sm h-80 flex items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer"
                >
                    <div className="absolute inset-0 bg-football-pattern opacity-[0.03]"></div>
                    <div className="text-center z-10">
                        <TrendingUp className="w-12 h-12 text-muted mx-auto mb-4 group-hover:text-primary/50 transition-colors" />
                        <p className="text-muted-foreground font-medium">Gráfico de Valor de Mercado</p>
                        <p className="text-xs text-muted mt-1">(Próximamente)</p>
                    </div>
                </div>

                <div
                    onClick={() => handleFeatureClick("Actividad Reciente")}
                    className="bg-card p-6 rounded-xl border border-border shadow-sm h-80 flex items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer"
                >
                    <div className="absolute inset-0 bg-football-pattern opacity-[0.03]"></div>
                    <div className="text-center z-10">
                        <Activity className="w-12 h-12 text-muted mx-auto mb-4 group-hover:text-primary/50 transition-colors" />
                        <p className="text-muted-foreground font-medium">Actividad Reciente</p>
                        <p className="text-xs text-muted mt-1">(Próximamente)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
