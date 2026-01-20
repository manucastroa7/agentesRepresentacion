import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/context/authStore';
import { API_BASE_URL } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
    const { token } = useAuthStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('agent');
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm();

    // Player specific states
    const [hasAgent, setHasAgent] = useState(false);
    const [agentsList, setAgentsList] = useState<any[]>([]);
    const [inviteAgent, setInviteAgent] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab === 'player') {
            fetchAgents();
        }
    }, [isOpen, activeTab]);

    const fetchAgents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/superadmin/users?role=agent`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setAgentsList(result.data || result);
            }
        } catch (error) {
            console.error("Error fetching agents", error);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            // Prepare payload based on role
            const payload: any = {
                email: data.email,
                password: data.password,
                role: activeTab, // agent, player, club
                profileData: {}
            };

            if (activeTab === 'agent') {
                payload.profileData = { agencyName: data.agencyName };
            } else if (activeTab === 'player') {
                payload.profileData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    position: data.position
                };

                // Advanced Representation Logic
                if (hasAgent) {
                    payload.representationMode = 'REPRESENTED';
                    if (inviteAgent) {
                        payload.agentData = {
                            email: data.agentInviteEmail,
                            name: data.agentInviteName
                        };
                    } else if (data.selectedAgentId) {
                        payload.agentData = {
                            id: data.selectedAgentId
                        };
                    }
                } else {
                    payload.representationMode = 'FREE';
                }

            } else if (activeTab === 'club') {
                payload.profileData = {
                    clubName: data.clubName,
                    category: data.category
                };
            }

            const response = await fetch(`${API_BASE_URL}/superadmin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast({
                    title: "Usuario Creado",
                    description: `El usuario tipo ${activeTab.toUpperCase()} ha sido creado exitosamente.`,
                    className: "bg-[#39FF14] text-black border-none"
                });
                reset();
                setHasAgent(false);
                setInviteAgent(false);
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                if (response.status === 400 && errorData.message === 'El usuario ya existe') {
                    toast({
                        title: "Usuario Duplicado",
                        description: `El email ${data.email} ya está registrado en el sistema.`,
                        variant: "destructive",
                        className: "border-red-500 bg-red-950 text-white"
                    });
                } else {
                    toast({
                        title: "Error",
                        description: errorData.message || "No se pudo crear el usuario.",
                        variant: "destructive"
                    });
                }
            }
        } catch (error) {
            console.error("Error creating user", error);
            toast({
                title: "Error de Conexión",
                description: "Verifica tu conexión e intenta nuevamente.",
                variant: "destructive"
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                    <h3 className="text-xl font-bold text-white">Nuevo Usuario (God Mode)</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="p-6">
                    <Tabs defaultValue="agent" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-950 mb-6">
                            <TabsTrigger value="agent">Agente</TabsTrigger>
                            <TabsTrigger value="player">Jugador</TabsTrigger>
                            <TabsTrigger value="club">Club</TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Common Fields */}
                            <div className="space-y-2">
                                <Label className="text-slate-400">Email</Label>
                                <Input
                                    {...register('email', { required: true })}
                                    type="email"
                                    className="bg-slate-950 border-white/10 text-white"
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400">Contraseña</Label>
                                <Input
                                    {...register('password', { required: true, minLength: 6 })}
                                    type="password"
                                    className="bg-slate-950 border-white/10 text-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Role Specific Fields */}
                            {activeTab === 'agent' && (
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Nombre de Agencia</Label>
                                    <Input
                                        {...register('agencyName', { required: activeTab === 'agent' })}
                                        className="bg-slate-950 border-white/10 text-white"
                                        placeholder="Ej. Elite Sports"
                                    />
                                </div>
                            )}

                            {activeTab === 'player' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400">Nombre</Label>
                                            <Input
                                                {...register('firstName', { required: activeTab === 'player' })}
                                                className="bg-slate-950 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400">Apellido</Label>
                                            <Input
                                                {...register('lastName', { required: activeTab === 'player' })}
                                                className="bg-slate-950 border-white/10 text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Posición</Label>
                                        <Input
                                            {...register('position', { required: activeTab === 'player' })}
                                            className="bg-slate-950 border-white/10 text-white"
                                            placeholder="Ej. Delantero"
                                        />
                                    </div>

                                    {/* Agent Representation Section */}
                                    <div className="pt-4 border-t border-white/10 space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasAgent"
                                                checked={hasAgent}
                                                onCheckedChange={(checked) => setHasAgent(checked as boolean)}
                                                className="border-white/20 data-[state=checked]:bg-[#39FF14] data-[state=checked]:text-black"
                                            />
                                            <Label htmlFor="hasAgent" className="text-white cursor-pointer select-none">
                                                ¿Tiene Representante?
                                            </Label>
                                        </div>

                                        {hasAgent && (
                                            <div className="space-y-3 pl-6 border-l-2 border-[#39FF14]/20 animate-in slide-in-from-left-2 duration-300">
                                                {!inviteAgent ? (
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-400">Seleccionar Agente</Label>
                                                        <Select onValueChange={(val) => setValue('selectedAgentId', val)}>
                                                            <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                                                                <SelectValue placeholder="Buscar agencia..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                                {agentsList.map(agent => (
                                                                    <SelectItem key={agent.id} value={agent.id}>
                                                                        {agent.agencyName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                        <div className="pt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setInviteAgent(true)}
                                                                className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                                            >
                                                                ¿No encuentras al agente? Invítalo aquí.
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="space-y-2">
                                                            <Label className="text-slate-400 text-xs">Email del Agente a Invitar</Label>
                                                            <Input
                                                                {...register('agentInviteEmail')}
                                                                placeholder="agente@email.com"
                                                                className="bg-slate-950 border-white/10 text-white h-9"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-slate-400 text-xs">Nombre (Opcional)</Label>
                                                            <Input
                                                                {...register('agentInviteName')}
                                                                placeholder="Nombre del Agente"
                                                                className="bg-slate-950 border-white/10 text-white h-9"
                                                            />
                                                        </div>
                                                        <div className="pt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setInviteAgent(false)}
                                                                className="text-xs text-slate-400 hover:text-white"
                                                            >
                                                                ← Volver a lista de agentes
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'club' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Nombre del Club</Label>
                                        <Input
                                            {...register('clubName', { required: activeTab === 'club' })}
                                            className="bg-slate-950 border-white/10 text-white"
                                            placeholder="Ej. Real Madrid"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Categoría</Label>
                                        <Input
                                            {...register('category', { required: activeTab === 'club' })}
                                            className="bg-slate-950 border-white/10 text-white"
                                            placeholder="Ej. Primera División"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#39FF14] hover:bg-[#32d912] text-slate-950 font-bold py-3"
                                >
                                    {isSubmitting ? 'Creando...' : 'CREAR USUARIO'}
                                </Button>
                            </div>
                        </form>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateUserModal;
