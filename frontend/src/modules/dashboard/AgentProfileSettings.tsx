import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Upload, Phone, Globe, MapPin, Instagram, Linkedin, Twitter, Shield, Sparkles, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import { useToast } from '@/hooks/use-toast';

type FormValues = {
    agencyName: string;
    email: string;
    logo: string;
    phone: string;
    website: string;
    location: string;
    bio: string;
    instagram: string;
    linkedin: string;
    twitter: string;
};

const CLOUD_NAME = 'drghwlpwe'; // TODO: centralize in env/config
const UPLOAD_PRESET = 'agentsport_unsigned';

const AgentProfileSettings = () => {
    const { token, user } = useAuthStore();
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            agencyName: '',
            email: '',
            logo: '',
            phone: '',
            website: '',
            location: '',
            bio: '',
            instagram: '',
            linkedin: '',
            twitter: '',
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:3000/agents/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    toast({
                        title: 'No se pudo cargar el perfil',
                        description: 'Intenta recargar o revisa tu conexión.',
                        variant: 'destructive',
                    });
                    return;
                }
                const json = await response.json();
                const profile = json.data || json;
                reset({
                    agencyName: profile.agencyName || '',
                    email: profile.user?.email || user?.email || '',
                    logo: profile.logo || '',
                    phone: profile.phone || '',
                    website: profile.website || '',
                    location: profile.location || '',
                    bio: profile.bio || '',
                    instagram: profile.socialLinks?.instagram || '',
                    linkedin: profile.socialLinks?.linkedin || '',
                    twitter: profile.socialLinks?.twitter || '',
                });
                if (profile.logo) setLogoPreview(profile.logo);
            } catch (error) {
                console.error('Error fetching profile', error);
                toast({
                    title: 'Error al cargar',
                    description: 'No pudimos obtener tus datos. Inténtalo nuevamente.',
                    variant: 'destructive',
                });
            }
        };

        fetchProfile();
    }, [token, reset, toast, user?.email]);

    const handleLogoUpload = async (file: File) => {
        setUploadingLogo(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.secure_url) {
                setValue('logo', data.secure_url);
                setLogoPreview(data.secure_url);
                toast({ title: 'Logo actualizado', description: 'Tu logo fue subido correctamente.' });
            } else {
                throw new Error(data.error?.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error uploading logo', error);
            toast({
                title: 'No se pudo subir el logo',
                description: 'Revisa la conexión o el tamaño del archivo.',
                variant: 'destructive',
            });
        } finally {
            setUploadingLogo(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        if (!token) return;
        const payload = {
            phone: values.phone || undefined,
            website: values.website || undefined,
            location: values.location || undefined,
            bio: values.bio || undefined,
            logo: values.logo || logoPreview || undefined,
            socialLinks: {
                instagram: values.instagram || undefined,
                linkedin: values.linkedin || undefined,
                twitter: values.twitter || undefined,
            },
        };

        if (!token) {
            toast({
                title: 'Sesión no válida',
                description: 'Vuelve a iniciar sesión para guardar los cambios.',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('http://localhost:3000/agents/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Status ${response.status}: ${text}`);
            }

            const json = await response.json();
            const updated = json.data || json;
            reset({
                agencyName: updated.agencyName || '',
                email: updated.user?.email || values.email,
                logo: updated.logo || '',
                phone: updated.phone || '',
                website: updated.website || '',
                location: updated.location || '',
                bio: updated.bio || '',
                instagram: updated.socialLinks?.instagram || '',
                linkedin: updated.socialLinks?.linkedin || '',
                twitter: updated.socialLinks?.twitter || '',
            });
            if (updated.logo) setLogoPreview(updated.logo);

            toast({
                title: 'Perfil guardado',
                description: 'Tu perfil de agencia fue actualizado con éxito.',
                variant: 'success',
            });
        } catch (error) {
            console.error('Error saving profile', error);
            toast({
                title: 'No se pudo guardar',
                description: 'Revisa los datos e inténtalo nuevamente.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-full space-y-8 pb-16">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                        <Shield size={16} className="text-[#39FF14]" />
                        Perfil de Agencia
                    </p>
                    <h1 className="text-4xl font-display font-bold text-white mt-2">Configuración</h1>
                    <p className="text-slate-400">Actualiza tu branding y datos de contacto. La identidad se mantiene protegida.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-slate-200">
                    <Sparkles className="text-[#39FF14]" size={18} />
                    <span className="text-sm">Modo Dark Sport Premium</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Identity - Locked */}
                <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Lock className="text-[#39FF14]" size={18} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Identidad protegida</p>
                            <h3 className="text-white text-xl font-display font-bold">Agencia y correo</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                <Lock size={14} />
                                Agency Name
                            </label>
                            <input
                                {...register('agencyName')}
                                disabled
                                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed opacity-60"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                                <Lock size={14} />
                                Email
                            </label>
                            <input
                                {...register('email')}
                                disabled
                                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* Branding */}
                <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center">
                            <Upload className="text-[#39FF14]" size={18} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Branding</p>
                            <h3 className="text-white text-xl font-display font-bold">Logo y presencia</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full border-2 border-white/10 bg-slate-950/80 overflow-hidden flex items-center justify-center">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-600 text-sm">Sin logo</span>
                                )}
                            </div>
                            <div>
                                <p className="text-white font-semibold">Logo circular</p>
                                <p className="text-slate-400 text-sm">PNG / JPG · Fondo transparente recomendado</p>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm text-slate-400 mb-2 block">URL del logo (opcional)</label>
                            <input
                                {...register('logo')}
                                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                placeholder="https://..."
                            />
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                    className={`px-4 py-2 rounded-lg border border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10 transition-all text-sm font-semibold ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={uploadingLogo}
                                >
                                    {uploadingLogo ? 'Subiendo...' : 'Subir a Cloudinary'}
                                </button>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <LinkIcon size={14} className="text-slate-500" /> Puedes pegar una URL directa si ya tienes el logo.
                                </p>
                            </div>
                            <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files && handleLogoUpload(e.target.files[0])}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact & Bio */}
                <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <Phone className="text-[#39FF14]" size={18} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Contacto</p>
                            <h3 className="text-white text-xl font-display font-bold">Datos y bio</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Teléfono / WhatsApp</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                                    <Phone size={16} />
                                </div>
                                <input
                                    {...register('phone')}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                    placeholder="+54 9 11 0000 0000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Sitio web</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                                    <Globe size={16} />
                                </div>
                                <input
                                    {...register('website')}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                    placeholder="https://tuagencia.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Ubicación</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                                    <MapPin size={16} />
                                </div>
                                <input
                                    {...register('location')}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                    placeholder="Buenos Aires, Argentina"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="text-sm text-slate-400 mb-2 block">Sobre la agencia</label>
                        <textarea
                            {...register('bio')}
                            rows={5}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none resize-none"
                            placeholder="Cuéntale al mundo tu propuesta de valor y trayectoria."
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <LinkIcon className="text-[#39FF14]" size={18} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Redes</p>
                            <h3 className="text-white text-xl font-display font-bold">Social Media</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Instagram</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                                    <Instagram size={16} />
                                </div>
                                <input
                                    {...register('instagram')}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                    placeholder="https://instagram.com/tuagencia"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">LinkedIn</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                                    <Linkedin size={16} />
                                </div>
                                <input
                                    {...register('linkedin')}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                    placeholder="https://www.linkedin.com/company/tuagencia"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Twitter</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                                    <Twitter size={16} />
                                </div>
                                <input
                                    {...register('twitter')}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#39FF14]/60 focus:outline-none"
                                    placeholder="https://twitter.com/tuagencia"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadingLogo || isSaving}
                        className="px-8 py-3 bg-[#39FF14] text-slate-950 font-bold rounded-xl shadow-[0_0_25px_rgba(57,255,20,0.35)] hover:bg-[#32d912] transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting || isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentProfileSettings;
