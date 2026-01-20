import { useState, useEffect } from 'react';
import { applicationsService, type Application } from '@/modules/applications/services/applications.service';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, User, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AgentApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await applicationsService.findAllForAgent();
            setApplications(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron cargar las solicitudes.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: 'accepted' | 'rejected') => {
        try {
            await applicationsService.updateStatus(id, status);
            toast({
                title: status === 'accepted' ? "Solicitud Aceptada" : "Solicitud Rechazada",
                description: status === 'accepted' ? "El jugador ha sido añadido a tu plantel." : "La solicitud ha sido descartada.",
                className: status === 'accepted' ? "bg-[#39FF14] text-slate-950 font-bold" : "",
            });
            // Reload to refresh list
            loadApplications();
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado.",
                variant: "destructive"
            });
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Cargando solicitudes...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Solicitudes Recibidas</h1>
                <p className="text-slate-400 mt-2">Gestiona las postulaciones de jugadores que quieren unirse a tu agencia.</p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-white/5">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No hay solicitudes pendientes</h3>
                    <p className="text-slate-500">Cuando un jugador postule a tu agencia, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="bg-slate-900 border-white/10 hover:border-white/20 transition-colors">
                            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/10">
                                        <User size={24} className="text-slate-400" />
                                        {/* TODO: Show player avatar if available */}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-white hover:text-[#39FF14] cursor-pointer" onClick={() => navigate(`/p/${app.player?.id}`)}>
                                                {app.player?.firstName} {app.player?.lastName}
                                            </h3>
                                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase border border-blue-500/20">
                                                Postulante
                                            </span>
                                        </div>
                                        <div className="text-slate-400 text-sm flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                            {/* Position could go here if added to DTO/Entity relation */}
                                        </div>
                                        {app.message && (
                                            <div className="mt-3 p-3 bg-slate-950/50 rounded-lg text-sm text-slate-300 italic border border-white/5 max-w-2xl">
                                                "{app.message}"
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <Button
                                        variant="outline"
                                        className="flex-1 md:flex-none border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40"
                                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                    >
                                        <X size={16} className="mr-2" />
                                        Rechazar
                                    </Button>
                                    <Button
                                        className="flex-1 md:flex-none bg-[#39FF14] text-slate-950 hover:bg-[#32d912] font-bold"
                                        onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                    >
                                        <Check size={16} className="mr-2" />
                                        Aceptar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentApplicationsPage;
