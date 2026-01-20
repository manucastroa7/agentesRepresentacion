import { useState, useEffect } from 'react';
import { X, Save, Loader2, Mail, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '@/config/api';
import { useAuthStore } from '@/context/authStore';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userData: {
        id: string; // ID of the entity (Agent/Player/Club)
        type: 'agent' | 'player' | 'club';
        agencyName?: string; // For Agent
        email: string;
        slug?: string;
    } | null;
}

interface EditFormData {
    agencyName?: string;
    email: string;
    slug?: string;
    password?: string;
}

const EditUserModal = ({ isOpen, onClose, onSuccess, userData }: EditUserModalProps) => {
    const { token } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditFormData>();

    useEffect(() => {
        if (userData) {
            setValue('email', userData.email);
            if (userData.type === 'agent' && userData.agencyName) {
                setValue('agencyName', userData.agencyName);
                if (userData.slug) setValue('slug', userData.slug);
            }
        }
    }, [userData, setValue]);

    const onSubmit = async (data: EditFormData) => {
        if (!userData) return;

        setIsLoading(true);
        setError('');

        try {
            let endpoint = '';
            if (userData.type === 'agent') {
                endpoint = `${API_BASE_URL}/superadmin/agents/${userData.id}`;
            } else {
                // Placeholder until Player/Club update is implemented
                setError('Edición solo disponible para Agentes por el momento');
                setIsLoading(false);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar');
            }

            reset();
            onSuccess();
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendRecovery = async () => {
        if (!userData?.email) return;
        setIsSendingEmail(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email }),
            });
            if (response.ok) {
                alert('Correo de recuperación enviado correctamente.');
            } else {
                throw new Error('Error al enviar correo.');
            }
        } catch (err) {
            alert('Error al enviar el correo. Intenta nuevamente.');
        } finally {
            setIsSendingEmail(false);
        }
    };

    if (!isOpen || !userData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Editar Usuario</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

                    {userData.type === 'agent' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Nombre de la Agencia</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#39FF14] transition-colors" size={18} />
                                    <input
                                        {...register('agencyName', { required: 'El nombre es requerido' })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-[#39FF14] focus:outline-none transition-colors"
                                        placeholder="Nombre de Agencia"
                                    />
                                </div>
                                {errors.agencyName && <span className="text-red-400 text-xs">{errors.agencyName.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Usuario (Slug)</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-3 text-slate-500 font-bold text-lg">@</span>
                                    <input
                                        {...register('slug', {
                                            required: 'El slug es requerido',
                                            pattern: {
                                                value: /^[a-z0-9-]+$/,
                                                message: 'Solo minúsculas, números y guiones'
                                            }
                                        })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-[#39FF14] focus:outline-none transition-colors"
                                        placeholder="nombre-de-usuario"
                                    />
                                </div>
                                {errors.slug && <span className="text-red-400 text-xs">{errors.slug.message}</span>}
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#39FF14] transition-colors" size={18} />
                            <input
                                {...register('email', {
                                    required: 'El email es requerido',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
                                })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-[#39FF14] focus:outline-none transition-colors"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Contraseña (Opcional)</label>
                        <div className="relative group">
                            <input
                                {...register('password')}
                                type="text"
                                className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-[#39FF14] focus:outline-none transition-colors"
                                placeholder="Escribe para cambiarla..."
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <button
                            type="button"
                            onClick={handleSendRecovery}
                            disabled={isSendingEmail}
                            className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-blue-500/20"
                        >
                            {isSendingEmail ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                            Enviar Correo de Recuperación
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-[#39FF14] hover:bg-[#32d912] text-slate-950 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
