import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Trophy, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '@/services/api';

// --- Zod Schemas ---

const baseSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    confirmPassword: z.string(),
    country: z.string().min(1, { message: "País requerido" }),
});

const passwordRefinement = (data: any) => data.password === data.confirmPassword;
const passwordRefinementOptions = {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
};

const agentSchema = baseSchema.extend({
    role: z.literal('agent'),
    agencyName: z.string().min(2, { message: "Nombre de agencia requerido" }),
    phone: z.string().min(5, { message: "Teléfono requerido" }),
    website: z.string().optional(),
}).refine(passwordRefinement, passwordRefinementOptions);

const playerSchema = baseSchema.extend({
    role: z.literal('player'),
    fullName: z.string().min(2, { message: "Nombre completo requerido" }),
    birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
    position: z.enum(['arquero', 'defensor', 'medio', 'delantero']),
    preferredFoot: z.enum(['derecho', 'izquierdo', 'ambidiestro']),
}).refine(passwordRefinement, passwordRefinementOptions);

const clubSchema = baseSchema.extend({
    role: z.literal('club'),
    clubName: z.string().min(2, { message: "Nombre del club requerido" }),
    jobTitle: z.string().min(2, { message: "Cargo requerido" }),
    league: z.string().min(2, { message: "Liga requerida" }),
}).refine(passwordRefinement, passwordRefinementOptions);

type FormData = z.infer<typeof agentSchema> | z.infer<typeof playerSchema> | z.infer<typeof clubSchema>;

const RegisterPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();

    // State
    const [role, setRole] = useState<'agent' | 'player' | 'club' | null>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Initialize from URL
    useEffect(() => {
        const urlRole = searchParams.get('role');
        if (urlRole === 'agent' || urlRole === 'player' || urlRole === 'club') {
            setRole(urlRole);
            setStep(2);
        }
    }, [searchParams]);

    // Form Hook
    const getResolver = () => {
        switch (role) {
            case 'agent': return zodResolver(agentSchema);
            case 'player': return zodResolver(playerSchema);
            case 'club': return zodResolver(clubSchema);
            default: return zodResolver(baseSchema); // Fallback
        }
    };

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: getResolver() as any,
        defaultValues: {
            role: role || undefined,
        }
    });

    // Update role in form when state changes
    useEffect(() => {
        if (role) setValue('role', role);
    }, [role, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await api.post('/auth/register', data);
            toast({
                title: "¡Bienvenido a AgentSport!",
                description: "Tu cuenta ha sido creada exitosamente.",
                className: "bg-[#39FF14] text-black border-none"
            });
            navigate('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            const msg = error.response?.data?.message || 'Error al registrarse';
            toast({
                title: "Error de Registro",
                description: Array.isArray(msg) ? msg[0] : msg,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Renders ---

    const renderRoleSelection = () => (
        <div className="w-full max-w-5xl mx-auto grid md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
            {[
                {
                    id: 'player',
                    title: 'Soy Jugador',
                    desc: 'Busco club y representante.',
                    icon: Trophy,
                    color: 'text-[#39FF14]',
                    borderColor: 'group-hover:border-[#39FF14]'
                },
                {
                    id: 'agent',
                    title: 'Soy Agente',
                    desc: 'Gestiono talentos y carreras.',
                    icon: Shield,
                    color: 'text-blue-500',
                    borderColor: 'group-hover:border-blue-500'
                },
                {
                    id: 'club',
                    title: 'Soy Club',
                    desc: 'Busco fichajes para mi equipo.',
                    icon: Building2,
                    color: 'text-indigo-500',
                    borderColor: 'group-hover:border-indigo-500'
                }
            ].map((item) => (
                <div
                    key={item.id}
                    onClick={() => { setRole(item.id as any); setStep(2); }}
                    className={`group relative bg-slate-900/50 backdrop-blur-sm border-2 border-slate-800 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:bg-slate-900 hover:shadow-2xl hover:-translate-y-1 ${item.borderColor}`}
                >
                    <div className={`w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 transition-transform ${item.color}`}>
                        <item.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 font-medium">{item.desc}</p>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="text-white w-6 h-6" />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderFormFields = () => {
        switch (role) {
            case 'agent':
                return (
                    <>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Nombre de la Agencia</Label>
                            <Input {...register('agencyName' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="Ej: Elite Sports Management" />
                            {(errors as any).agencyName && <p className="text-red-500 text-xs mt-1">{(errors as any).agencyName.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Teléfono / WhatsApp</Label>
                                <Input {...register('phone' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="+54 9 11..." />
                                {(errors as any).phone && <p className="text-red-500 text-xs mt-1">{(errors as any).phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Sitio Web (Opcional)</Label>
                                <Input {...register('website' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="www.agencia.com" />
                            </div>
                        </div>
                    </>
                );
            case 'player':
                return (
                    <>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Nombre Completo</Label>
                            <Input {...register('fullName' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="Ej: Lionel Andrés..." />
                            {(errors as any).fullName && <p className="text-red-500 text-xs mt-1">{(errors as any).fullName.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Fecha de Nacimiento</Label>
                                <Input type="date" {...register('birthDate' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12 block w-full" />
                                {(errors as any).birthDate && <p className="text-red-500 text-xs mt-1">{(errors as any).birthDate.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Posición</Label>
                                <Select onValueChange={(val) => setValue('position' as any, val)}>
                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12">
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="arquero">Arquero</SelectItem>
                                        <SelectItem value="defensor">Defensor</SelectItem>
                                        <SelectItem value="medio">Mediocampista</SelectItem>
                                        <SelectItem value="delantero">Delantero</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(errors as any).position && <p className="text-red-500 text-xs mt-1">{(errors as any).position.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Pie Hábil</Label>
                            <Select onValueChange={(val) => setValue('preferredFoot' as any, val)}>
                                <SelectTrigger className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="derecho">Derecho</SelectItem>
                                    <SelectItem value="izquierdo">Izquierdo</SelectItem>
                                    <SelectItem value="ambidiestro">Ambidiestro</SelectItem>
                                </SelectContent>
                            </Select>
                            {(errors as any).preferredFoot && <p className="text-red-500 text-xs mt-1">{(errors as any).preferredFoot.message}</p>}
                        </div>
                    </>
                );
            case 'club':
                return (
                    <>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Nombre Oficial del Club</Label>
                            <Input {...register('clubName' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="Ej: Club Atlético..." />
                            {(errors as any).clubName && <p className="text-red-500 text-xs mt-1">{(errors as any).clubName.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Cargo</Label>
                                <Input {...register('jobTitle' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="Ej: Director Deportivo" />
                                {(errors as any).jobTitle && <p className="text-red-500 text-xs mt-1">{(errors as any).jobTitle.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Liga / Categoría</Label>
                                <Input {...register('league' as any)} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="Ej: Primera Nacional" />
                                {(errors as any).league && <p className="text-red-500 text-xs mt-1">{(errors as any).league.message}</p>}
                            </div>
                        </div>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-slate-950 p-4 font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -top-40 -left-20 animate-pulse"></div>
                <div className="absolute w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[100px] -bottom-20 -right-20"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            </div>

            <div className="relative z-10 w-full">

                {/* Back to Home Button */}
                <div className="absolute top-0 left-4 md:left-10">
                    <Link to="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 gap-2">
                            <ArrowLeft size={18} /> <span className="hidden md:inline">Volver al Inicio</span>
                        </Button>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-10 pt-10 md:pt-0">
                    <Link to="/" className="inline-block">
                        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter italic">
                            AGENT<span className="text-[#39FF14]">SPORT</span>
                        </h1>
                    </Link>
                    <p className="text-slate-400 mt-2 font-medium">El Ecosistema Profesional del Fútbol</p>
                </div>

                {step === 1 ? (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">¿Cuál es tu rol en el juego?</h2>
                            <p className="text-slate-400 max-w-lg mx-auto">Selecciona tu perfil para comenzar a personalizar tu experiencia en la plataforma.</p>
                        </div>
                        {renderRoleSelection()}
                    </>
                ) : (
                    <Card className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
                        <CardHeader className="text-center pb-2 border-b border-white/5">
                            <div className="absolute left-6 top-6">
                                <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="text-slate-400 hover:text-white hover:bg-white/5">
                                    <ArrowLeft size={20} />
                                </Button>
                            </div>
                            <CardTitle className="text-2xl text-white font-display uppercase italic tracking-wider pt-2">
                                Registro {role === 'agent' ? 'Agente' : role === 'player' ? 'Jugador' : 'Club'}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Completa tus datos profesionales
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                {/* Base Fields */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Email Profesional</Label>
                                    <Input {...register('email')} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="nombre@ejemplo.com" />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Contraseña</Label>
                                        <Input type="password" {...register('password')} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" />
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Repetir Contraseña</Label>
                                        <Input type="password" {...register('confirmPassword')} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" />
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">País de Residencia</Label>
                                    <Input {...register('country')} className="bg-slate-900 border-slate-800 text-white focus:ring-[#39FF14] h-12" placeholder="Ej: Argentina" />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                                </div>

                                {/* Dynamic Fields */}
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    {renderFormFields()}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-[#39FF14] hover:bg-[#32d612] text-slate-950 font-black text-lg uppercase tracking-widest mt-6 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all hover:scale-[1.02]"
                                    disabled={loading}
                                >
                                    {loading ? 'Creando Perfil...' : 'EMPEZAR AHORA'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
