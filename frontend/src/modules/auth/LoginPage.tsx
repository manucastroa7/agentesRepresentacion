import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { API_BASE_URL } from '@/config/api';
// Asegúrate de que esta ruta a la imagen sea correcta en tu proyecto
import stadiumBg from '@/assets/stadium-bg.png';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setLoginError('');

        console.log("🚀 1. Enviando credenciales:", data.email);

        try {
            // Petición al Backend
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            console.log("📡 2. Status del servidor:", response.status);

            // Manejo de errores HTTP específicos
            if (!response.ok) {
                if (response.status === 401) throw new Error('Usuario o contraseña incorrectos');
                if (response.status === 403) throw new Error('Acceso denegado');
                throw new Error(`Error del servidor (${response.status})`);
            }

            const result = await response.json();
            console.log("🔑 3. Respuesta completa del servidor:", result);

            // El backend usa un ResponseInterceptor que envuelve la respuesta en { statusCode, data }
            // Intentamos obtener el token de result.data.access_token o result.access_token por si acaso
            const accessToken = result.data?.access_token || result.access_token;

            if (!accessToken) {
                console.error("⚠️ El servidor respondió sin access_token. Respuesta completa:", result);
                throw new Error('El servidor no envió el token de acceso.');
            }

            // Decodificar Token para obtener el usuario
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            console.log("👤 4. Payload del token:", payload);
            console.log("👤 5. Rol detectado:", payload.role);

            // Actualizar el authStore con el usuario y token
            const user = { firstName: payload.firstName, lastName: payload.lastName, agencyName: payload.agencyName, agentSlug: payload.slug, avatarUrl: payload.avatarUrl,
                id: payload.sub,
                email: payload.email,
                role: payload.role as 'superadmin' | 'agent' | 'user'
            };

            console.log("💾 6. Guardando en authStore:", user);
            login(user, accessToken);

            // Redirección basada en Rol
            console.log("🚦 7. Redirigiendo según rol:", payload.role);
            if (payload.role === 'superadmin') {
                console.log("➡️ Navegando a /superadmin");
                navigate('/superadmin');
            } else {
                console.log("➡️ Navegando a /dashboard");
                navigate('/dashboard');
            }

        } catch (error) {
            console.error("❌ ERROR FINAL:", error);
            // Si el error es de red (fetch falló completamente), suele ser CORS o servidor apagado
            if (error instanceof Error) {
                if (error.message === 'Failed to fetch') {
                    setLoginError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
                } else {
                    setLoginError(error.message);
                }
            } else {
                setLoginError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-8 left-8 text-white/50 hover:text-[#39FF14] flex items-center gap-2 transition-all z-20 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Volver al inicio</span>
            </Link>

            {/* Background Image con Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={stadiumBg}
                    alt="Stadium Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
            </div>

            {/* Glassmorphism Container */}
            <div className="relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-display font-bold text-4xl text-white mb-2 tracking-wide uppercase italic">
                        Agent Sport
                    </h1>
                    <p className="text-slate-400 text-lg font-light">
                        Ingresa al área técnica
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Email Input */}
                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#39FF14] transition-colors" />
                            </div>
                            <input
                                {...register("email", { required: true })}
                                type="email"
                                placeholder="Correo electrónico"
                                className="w-full pl-11 pr-4 py-3 bg-slate-950 text-white placeholder-slate-500 rounded-lg border border-slate-800 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] focus:outline-none transition-all duration-300"
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-xs ml-1">El correo es requerido</span>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#39FF14] transition-colors" />
                            </div>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                placeholder="Contraseña"
                                className="w-full pl-11 pr-4 py-3 bg-slate-950 text-white placeholder-slate-500 rounded-lg border border-slate-800 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] focus:outline-none transition-all duration-300"
                            />
                        </div>
                        {errors.password && <span className="text-red-500 text-xs ml-1">La contraseña es requerida</span>}
                    </div>

                    {/* Mensaje de Error */}
                    {loginError && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{loginError}</span>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[#39FF14] text-black font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-[#32d613] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'INICIAR SESIÓN'}
                    </button>

                    {/* Footer Links */}
                    <div className="flex flex-col items-center space-y-4 pt-2">
                        <Link
                            to="/forgot-password"
                            className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default LoginPage;
