import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ChevronLeft, Send } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const ForgotPasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const onSubmit = async (data: { email: string }) => {
        setStatus('loading');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Si el correo existe, recibirás un enlace de recuperación en breve.');
            } else {
                setStatus('error');
                setMessage('Hubo un problema al procesar tu solicitud.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error de conexión. Inténtalo más tarde.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#39FF14]/5 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-medium text-sm">
                    <ChevronLeft size={16} className="mr-1" /> Volver al Login
                </Link>

                <div className="mb-8">
                    <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center mb-4 text-[#39FF14]">
                        <Mail size={24} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Recuperar Contraseña</h1>
                    <p className="text-slate-400">Ingresa tu email y te enviaremos las instrucciones para restablecer tu acceso.</p>
                </div>

                {status === 'success' ? (
                    <div className="bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-[#39FF14] rounded-full flex items-center justify-center mx-auto mb-3 text-slate-950">
                            <Send size={20} />
                        </div>
                        <h3 className="text-white font-bold mb-2">¡Correo Enviado!</h3>
                        <p className="text-slate-300 text-sm mb-4">{message}</p>
                        <Link to="/login" className="text-[#39FF14] font-bold hover:underline">Volver a Iniciar Sesión</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    {...register('email', {
                                        required: 'El email es requerido',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
                                    })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-12 text-white focus:border-[#39FF14] focus:outline-none transition-all placeholder:text-slate-600"
                                    placeholder="ejemplo@email.com"
                                    disabled={status === 'loading'}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-[#39FF14] hover:bg-[#32d912] text-slate-950 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
