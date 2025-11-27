import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Unlock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import stadiumBg from '@/assets/stadium-bg.png';

const ForgotPasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = (data: any) => {
        console.log(data);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${stadiumBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-slate-950/80" />
            </div>

            {/* Glassmorphism Container */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-2xl"
            >
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <Unlock className="h-12 w-12 text-[#39FF14]" />
                                </div>
                                <h1 className="font-display font-bold text-3xl text-white mb-3 tracking-wide">
                                    ¿Olvidaste tu contraseña?
                                </h1>
                                <p className="text-slate-300 text-sm font-light px-4">
                                    No te quedes fuera del partido. Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu acceso.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-white transition-colors" />
                                        </div>
                                        <input
                                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                            type="email"
                                            placeholder="Correo electrónico"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-950 text-white placeholder-slate-500 rounded-lg border-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#39FF14] focus:outline-none transition-all duration-300"
                                        />
                                    </div>
                                    {errors.email && <span className="text-red-500 text-sm">Ingresa un correo válido</span>}
                                </div>

                                {/* Action Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-[#39FF14] text-slate-950 font-bold text-lg rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all duration-300 transform active:scale-95 uppercase tracking-wider"
                                >
                                    Enviar Enlace
                                </button>

                                {/* Back Link */}
                                <div className="flex justify-center pt-2">
                                    <Link
                                        to="/login"
                                        className="flex items-center text-slate-400 hover:text-white text-sm transition-colors duration-200 group"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                        Volver al Login
                                    </Link>
                                </div>

                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-center py-8"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-[#39FF14]/20 p-4">
                                    <CheckCircle className="h-16 w-16 text-[#39FF14]" />
                                </div>
                            </div>
                            <h2 className="font-display font-bold text-2xl text-white mb-4">
                                ¡Enlace Enviado!
                            </h2>
                            <p className="text-slate-300 text-sm mb-8">
                                Hemos enviado las instrucciones de recuperación a tu correo electrónico. Revisa tu bandeja de entrada (y spam).
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center text-[#39FF14] hover:text-white font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver al Login
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
