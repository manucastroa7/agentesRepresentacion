import { useState, useEffect } from 'react';
import { agentsService, type PublicAgent } from '@/modules/agents/services/agents.service';
import { applicationsService } from '@/modules/applications/services/applications.service';
import { useToast } from '@/components/ui/use-toast';
import { Search, MapPin, Send } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FindAgentPage = () => {
    const [agents, setAgents] = useState<PublicAgent[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState<PublicAgent | null>(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        try {
            const data = await agentsService.findAll();
            setAgents(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron cargar las agencias.",
                variant: "destructive"
            });
        }
    };

    const handleApply = async () => {
        if (!selectedAgent) return;
        setIsLoading(true);
        try {
            await applicationsService.create(selectedAgent.id, message);
            toast({
                title: "Solicitud Enviada",
                description: `Tu solicitud para ${selectedAgent.agencyName} ha sido enviada con exito.`,
                className: "bg-[#39FF14] text-slate-950 font-bold",
            });
            setSelectedAgent(null);
            setMessage('');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Hubo un error al enviar la solicitud.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAgents = agents.filter(agent =>
        agent.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Buscar Agente</h1>
                    <p className="text-slate-400 mt-2">Encuentra y postula a las mejores agencias.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <Input
                        placeholder="Buscar por nombre o ubicacion..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map(agent => (
                    <Card key={agent.id} className="bg-slate-900 border-white/10 overflow-hidden hover:border-[#39FF14]/50 transition-colors group">
                        <CardHeader className="p-0 h-32 bg-slate-800 relative">
                            {/* Banner placeholder or gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-50" />
                            {agent.logo && (
                                <img src={agent.logo} alt={agent.agencyName} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            )}
                        </CardHeader>
                        <CardContent className="p-6 relative">
                            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-white/10 absolute -top-8 left-6 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                {agent.logo ? <img src={agent.logo} className="w-full h-full object-cover rounded-xl" /> : agent.agencyName.charAt(0)}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">{agent.agencyName}</h3>
                                {agent.location && (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                        <MapPin size={14} />
                                        <span>{agent.location}</span>
                                    </div>
                                )}
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                                    {agent.bio || "Sin descripcion disponible."}
                                </p>

                                <Button
                                    onClick={() => setSelectedAgent(agent)}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white hover:text-[#39FF14] border border-white/10"
                                >
                                    Solicitar Representacion
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Simple Modal for Application */}
            {selectedAgent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setSelectedAgent(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-white mb-2">Postular a {selectedAgent.agencyName}</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Envia un mensaje personal para presentarte. Tu perfil publico sera adjuntado automaticamente.
                        </p>

                        <div className="space-y-4">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hola, soy un delantero con experiencia en..."
                                className="w-full h-32 bg-slate-950 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#39FF14]"
                            />

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedAgent(null)}
                                    className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleApply}
                                    disabled={isLoading}
                                    className="flex-1 bg-[#39FF14] text-slate-950 hover:bg-[#32d912] font-bold"
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar Solicitud'} <Send size={16} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindAgentPage;
