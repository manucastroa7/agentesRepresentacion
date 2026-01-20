import { useState, useEffect } from 'react';
import { applicationsService, type Application } from '@/modules/applications/services/applications.service';
import { useToast } from '@/components/ui/use-toast';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await applicationsService.findAllForPlayer();
            setApplications(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron cargar tus solicitudes.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex gap-1 items-center"><Clock size={12} /> Esp. Respuesta</Badge>;
            case 'accepted':
                return <Badge variant="outline" className="bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 flex gap-1 items-center"><CheckCircle size={12} /> Aceptada</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 flex gap-1 items-center"><XCircle size={12} /> Rechazada</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Mis Solicitudes</h1>
                <p className="text-slate-400 mt-2">Historial de tus postulaciones a agencias.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-white/5">
                        <p className="text-slate-500">No has enviado ninguna solicitud aún.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <Card key={app.id} className="bg-slate-900 border-white/10">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {app.agent?.agencyName || 'Agencia Desconocida'}
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        Enviada el {new Date(app.createdAt).toLocaleDateString()}
                                    </p>
                                    {app.message && (
                                        <p className="text-sm text-slate-500 mt-2 italic">"{app.message}"</p>
                                    )}
                                </div>
                                <div>
                                    {getStatusBadge(app.status)}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
