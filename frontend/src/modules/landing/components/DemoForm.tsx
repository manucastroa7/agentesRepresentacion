import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import api from '@/services/api';

const demoSchema = z.object({
    name: z.string().min(2, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(6, 'Teléfono requerido'),
    agency: z.string().min(2, 'Nombre de agencia requerido'),
    message: z.string().optional(),
});

type DemoFormData = z.infer<typeof demoSchema>;

const DemoForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DemoFormData>({
        resolver: zodResolver(demoSchema),
    });

    const onSubmit = async (data: DemoFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await api.post('/demo-requests', data);
            setIsSuccess(true);
        } catch (err) {
            setError('Hubo un error al enviar la solicitud. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="py-24 bg-secondary text-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto bg-card/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-4">¡Solicitud Recibida!</h3>
                        <p className="text-gray-400">
                            Gracias por tu interés. Nuestro equipo te contactará a la brevedad para agendar tu demo personalizada.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="demo-form" className="py-24 bg-secondary relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-card/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* Left Side: Content */}
                        <div className="p-10 md:p-12 flex flex-col justify-center bg-gradient-to-br from-primary/10 to-transparent">
                            <h2 className="text-3xl font-display font-bold text-white mb-6">
                                Comienza tu prueba gratuita
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Únete a las agencias líderes que ya están transformando su gestión con AgentPro.
                            </p>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                                    Acceso completo por 14 días
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                                    Sin compromiso de compra
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                                    Soporte prioritario incluido
                                </li>
                            </ul>
                        </div>

                        {/* Right Side: Form */}
                        <div className="p-10 md:p-12 bg-card/5">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre</label>
                                        <input
                                            {...register('name')}
                                            className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="Tu nombre"
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Agencia</label>
                                        <input
                                            {...register('agency')}
                                            className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="Nombre agencia"
                                        />
                                        {errors.agency && <p className="text-red-400 text-xs mt-1">{errors.agency.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Teléfono</label>
                                    <input
                                        {...register('phone')}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="+54 9 11..."
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Mensaje (Opcional)</label>
                                    <textarea
                                        {...register('message')}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                        placeholder="¿Alguna pregunta específica?"
                                    />
                                </div>

                                {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            Enviar Solicitud <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoForm;
