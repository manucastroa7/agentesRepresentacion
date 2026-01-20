import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: any) => {
        if (!token) {
            setStatus('error');
            setMessage('Token no válido o faltante.');
            return;
        }

        setStatus('loading');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: data.password }),
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus('error');
                setMessage('El enlace ha expirado o es inválido.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error de conexión.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Enlace inválido</h2>
                    <p className="text-slate-400">No se proporcionó un token de recuperación.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-[#39FF14]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#39FF14] ring-1 ring-[#39FF14]/30">
                        <Lock size={28} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Nueva Contraseña</h1>
                    <p className="text-slate-400">Ingresa tu nueva contraseña segura.</p>
                </div>

                {status === 'success' ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-white font-bold mb-2">¡Contraseña Actualizada!</h3>
                        <p className="text-slate-300 text-sm">Serás redirigido al login en unos segundos...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Nueva Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Requerida',
                                        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                    })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:border-[#39FF14] focus:outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Confirmar Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        validate: (val: string) => {
                                            if (watch('password') !== val) {
                                                return 'Las contraseñas no coinciden';
                                            }
                                        }
                                    })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-12 text-white focus:border-[#39FF14] focus:outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message as string}</p>}
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-[#39FF14] hover:bg-[#32d912] text-slate-950 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                        >
                            {status === 'loading' ? 'Actualizando...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
