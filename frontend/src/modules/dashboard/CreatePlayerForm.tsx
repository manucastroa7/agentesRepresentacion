import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { User, Activity, ImageIcon, Save, ChevronDown, Plus, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import InputGroup from './components/InputGroup';
import AttributeSlider from './components/AttributeSlider';

interface FormData {
    firstName: string;
    lastName: string;
    position: string;
    nationality: string;
    foot: string;
    height: string;
    weight: string;
    birthDate: string;
    avatarUrl: string;
    videoUrl: string;
    status: string;
    stats: {
        speed: number;
        physical: number;
        technique: number;
        tactical: number;
        shooting: number;
        passing: number;
    };
    additionalInfo: Array<{ label: string; value: string }>;
}

const CreatePlayerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            position: '',
            nationality: '',
            foot: '',
            height: '',
            weight: '',
            birthDate: '',
            avatarUrl: '',
            videoUrl: '',
            status: 'watchlist',
            stats: {
                speed: 50,
                physical: 50,
                technique: 50,
                tactical: 50,
                shooting: 50,
                passing: 50
            },
            additionalInfo: []
        }
    });

    useEffect(() => {
        if (id && token) {
            const fetchPlayer = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/players/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const jsonResponse = await response.json();
                        // The backend wraps the response in { data: ... }, so we need to unwrap it if present
                        const data = jsonResponse.data || jsonResponse;

                        // Ensure stats and additionalInfo are correctly formatted
                        const formattedData = {
                            ...data,
                            height: data.height?.toString() || '',
                            weight: data.weight?.toString() || '',
                            birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
                            stats: data.stats || {
                                speed: 50,
                                physical: 50,
                                technique: 50,
                                tactical: 50,
                                shooting: 50,
                                passing: 50
                            },
                            additionalInfo: data.additionalInfo || []
                        };
                        console.log("📥 Player Data Loaded:", formattedData);
                        reset(formattedData);
                        if (data.avatarUrl) setPreviewUrl(data.avatarUrl);
                    } else {
                        console.error("Error fetching player data");
                        alert("Error al cargar los datos del jugador.");
                    }
                } catch (error) {
                    console.error("Network error:", error);
                    alert("Error de conexión al cargar datos.");
                }
            };
            fetchPlayer();
        }
    }, [id, token, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "additionalInfo"
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [videoSource, setVideoSource] = useState<'upload' | 'link'>('upload');

    // Cloudinary Config
    const CLOUD_NAME = 'drghwlpwe'; // ⚠️ REPLACE WITH YOUR CLOUD NAME
    const UPLOAD_PRESET = 'agentsport_unsigned'; // ⚠️ REPLACE WITH YOUR PRESET

    const handleImageUpload = async (file: File) => {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.secure_url) {
                setValue('avatarUrl', data.secure_url);
                setPreviewUrl(data.secure_url);
            } else {
                console.error('Upload failed', data);
                alert(`Error al subir imagen: ${data.error?.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error de red al subir imagen. Verifica tu conexión.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleVideoUpload = async (file: File) => {
        setUploadingVideo(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.secure_url) {
                setValue('videoUrl', data.secure_url);
            } else {
                console.error('Upload failed', data);
                alert(`Error al subir video: ${data.error?.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Error de red al subir video. Verifica tu conexión.');
        } finally {
            setUploadingVideo(false);
        }
    };

    const onSubmit = async (data: any) => {
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            position: data.position,
            nationality: data.nationality,
            foot: data.foot,
            height: parseFloat(data.height),
            weight: parseFloat(data.weight),
            birthDate: data.birthDate,
            avatarUrl: data.avatarUrl || 'https://via.placeholder.com/150',
            media: [],
            stats: data.stats,
            status: data.status,
            videoUrl: data.videoUrl,
            additionalInfo: data.additionalInfo
        };

        if (!token) {
            alert("Error: No estás autenticado.");
            return;
        }

        try {
            const url = id ? `http://localhost:3000/players/${id}` : 'http://localhost:3000/players';
            const method = id ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log(`Player ${id ? 'updated' : 'created'} successfully`);
                navigate('/dashboard/players');
            } else {
                console.error("Error saving player", await response.text());
                alert(`Error al ${id ? 'actualizar' : 'crear'} jugador.`);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    // Drag & Drop Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight">{id ? 'Editar Jugador' : 'Nuevo Jugador'}</h1>
                    <p className="text-slate-400 mt-1">{id ? 'Modifica la información del perfil.' : 'Completa la información para crear un nuevo perfil.'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard/players')}
                        className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={uploadingImage || uploadingVideo}
                        className={`px-8 py-3 bg-[#39FF14] hover:bg-[#32d912] text-slate-950 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center gap-2 ${uploadingImage || uploadingVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save size={20} />
                        {uploadingImage || uploadingVideo ? 'SUBIENDO...' : 'GUARDAR JUGADOR'}
                    </button>
                </div>
            </div>

            {/* Main Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">

                    {/* Tabs Header */}
                    <Tabs.List className="flex border-b border-white/5 bg-slate-950/50 px-6 pt-2">
                        {[
                            { id: 'personal', label: 'Datos Personales', icon: User },
                            { id: 'technical', label: 'Perfil Técnico', icon: Activity },
                            { id: 'multimedia', label: 'Multimedia', icon: ImageIcon },
                        ].map((tab) => (
                            <Tabs.Trigger
                                key={tab.id}
                                value={tab.id}
                                className={`
                                        group flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all
                                        ${activeTab === tab.id
                                        ? 'border-[#39FF14] text-[#39FF14]'
                                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/10'}
                                    `}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-[#39FF14]' : 'text-slate-500 group-hover:text-slate-300'} />
                                {tab.label}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    {/* Content Area */}
                    <div className="p-8 min-h-[500px]">

                        {/* --- TAB 1: PERSONAL DATA --- */}
                        <Tabs.Content value="personal" className="outline-none focus:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Nombre" error={errors.firstName}>
                                            <input
                                                {...register('firstName', { required: 'Requerido' })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all placeholder:text-slate-600"
                                                placeholder="Lionel"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Apellido" error={errors.lastName}>
                                            <input
                                                {...register('lastName', { required: 'Requerido' })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all placeholder:text-slate-600"
                                                placeholder="Messi"
                                            />
                                        </InputGroup>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Fecha de Nacimiento" error={errors.birthDate}>
                                            <input
                                                type="date"
                                                {...register('birthDate', { required: 'Requerido' })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all [color-scheme:dark]"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Nacionalidad">
                                            <div className="relative">
                                                <select
                                                    {...register('nationality')}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#39FF14] transition-all"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Argentina">🇦🇷 Argentina</option>
                                                    <option value="Brasil">🇧🇷 Brasil</option>
                                                    <option value="Uruguay">🇺🇾 Uruguay</option>
                                                    <option value="Colombia">🇨🇴 Colombia</option>
                                                    <option value="España">🇪🇸 España</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                            </div>
                                        </InputGroup>
                                    </div>

                                    <InputGroup label="Posición Principal">
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Portero', 'Defensa', 'Mediocampista', 'Delantero'].map((pos) => (
                                                <label
                                                    key={pos}
                                                    className={`
                                                            flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all
                                                            ${watch('position') === pos
                                                            ? 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14] font-bold'
                                                            : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/30'}
                                                        `}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={pos}
                                                        {...register('position')}
                                                        className="hidden"
                                                    />
                                                    {pos}
                                                </label>
                                            ))}
                                        </div>
                                    </InputGroup>
                                </div>

                                <div className="space-y-6">
                                    <InputGroup label="Pie Hábil">
                                        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
                                            {[
                                                { label: 'Diestro', value: 'right' },
                                                { label: 'Zurdo', value: 'left' },
                                                { label: 'Ambidextro', value: 'both' }
                                            ].map((foot) => (
                                                <label
                                                    key={foot.value}
                                                    className={`
                                                            flex-1 flex items-center justify-center py-2 rounded-lg cursor-pointer transition-all text-sm font-medium
                                                            ${watch('foot') === foot.value
                                                            ? 'bg-slate-800 text-white shadow-lg'
                                                            : 'text-slate-500 hover:text-slate-300'}
                                                        `}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={foot.value}
                                                        {...register('foot')}
                                                        className="hidden"
                                                    />
                                                    {foot.label}
                                                </label>
                                            ))}
                                        </div>
                                    </InputGroup>

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Altura (cm)">
                                            <input
                                                type="number"
                                                {...register('height')}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all"
                                                placeholder="180"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Peso (kg)">
                                            <input
                                                type="number"
                                                {...register('weight')}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all"
                                                placeholder="75"
                                            />
                                        </InputGroup>
                                    </div>

                                    <InputGroup label="Estado / Status">
                                        <div className="relative">
                                            <select
                                                {...register('status')}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#39FF14] transition-all"
                                            >
                                                <option value="signed">✅ Plantel (Firmado)</option>
                                                <option value="watchlist">🔭 Scouting: Observando</option>
                                                <option value="contacted">💬 Scouting: Contactado</option>
                                                <option value="priority">⭐ Scouting: Prioridad</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                        </div>
                                    </InputGroup>

                                    {/* Custom Fields Section */}
                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">Información Adicional</label>
                                            <button
                                                type="button"
                                                onClick={() => append({ label: '', value: '' })}
                                                className="text-[#39FF14] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Agregar Dato
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex gap-2">
                                                    <input
                                                        {...register(`additionalInfo.${index}.label` as const, { required: true })}
                                                        placeholder="Ej: Pasaporte"
                                                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#39FF14] outline-none"
                                                    />
                                                    <input
                                                        {...register(`additionalInfo.${index}.value` as const, { required: true })}
                                                        placeholder="Ej: Italiano"
                                                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#39FF14] outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {fields.length === 0 && (
                                                <p className="text-slate-600 text-xs italic">No hay datos adicionales. Agrega campos personalizados como 'Vencimiento de Contrato', 'Pasaporte', etc.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Tabs.Content>

                        {/* --- TAB 2: TECHNICAL PROFILE --- */}
                        <Tabs.Content value="technical" className="outline-none focus:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-12"
                            >
                                <div className="space-y-8">
                                    <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4 mb-6">Físico & Ritmo</h3>
                                    <Controller
                                        name="stats.speed"
                                        control={control}
                                        render={({ field }) => (
                                            <AttributeSlider label="Velocidad / Ritmo" value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <Controller
                                        name="stats.physical"
                                        control={control}
                                        render={({ field }) => (
                                            <AttributeSlider label="Físico / Resistencia" value={field.value} onChange={field.onChange} color="#FF3939" />
                                        )}
                                    />
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4 mb-6">Técnica & Táctica</h3>
                                    <Controller
                                        name="stats.technique"
                                        control={control}
                                        render={({ field }) => (
                                            <AttributeSlider label="Técnica / Control" value={field.value} onChange={field.onChange} color="#39DFFF" />
                                        )}
                                    />
                                    <Controller
                                        name="stats.tactical"
                                        control={control}
                                        render={({ field }) => (
                                            <AttributeSlider label="Inteligencia Táctica" value={field.value} onChange={field.onChange} color="#FFD739" />
                                        )}
                                    />
                                    <Controller
                                        name="stats.shooting"
                                        control={control}
                                        render={({ field }) => (
                                            <AttributeSlider label="Disparo / Finalización" value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <Controller
                                        name="stats.passing"
                                        control={control}
                                        render={({ field }) => (
                                            <AttributeSlider label="Pase / Visión" value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            </motion.div>
                        </Tabs.Content>

                        {/* --- TAB 3: MULTIMEDIA --- */}
                        <Tabs.Content value="multimedia" className="outline-none focus:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {/* Profile Photo */}
                                <div className="space-y-4">
                                    <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">Foto de Perfil</label>
                                    <div
                                        className={`
                                                relative aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group
                                                ${dragActive ? 'border-[#39FF14] bg-[#39FF14]/5' : 'border-white/10 bg-slate-950 hover:border-white/30'}
                                            `}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('photo-upload')?.click()}
                                    >
                                        {uploadingImage ? (
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#39FF14] mb-2"></div>
                                                <p className="text-slate-400 text-sm">Subiendo imagen...</p>
                                            </div>
                                        ) : previewUrl ? (
                                            <>
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white font-medium">Cambiar imagen</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="text-slate-400 group-hover:text-[#39FF14] transition-colors" size={24} />
                                                </div>
                                                <p className="text-white font-medium mb-1">Arrastra tu foto aquí</p>
                                                <p className="text-slate-500 text-sm">o haz clic para seleccionar</p>
                                            </div>
                                        )}
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                {/* Video Link */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setVideoSource('upload')}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${videoSource === 'upload' ? 'bg-[#39FF14] text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                                        >
                                            Subir Video
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVideoSource('link')}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${videoSource === 'link' ? 'bg-[#39FF14] text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                                        >
                                            Enlace Externo
                                        </button>
                                    </div>

                                    {videoSource === 'upload' ? (
                                        <InputGroup label="Subir Video (Highlights)">
                                            <div className="border border-white/10 rounded-xl p-6 bg-slate-950 text-center">
                                                {uploadingVideo ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#39FF14] mb-2"></div>
                                                        <p className="text-slate-400 text-sm">Subiendo video... Por favor espera.</p>
                                                    </div>
                                                ) : watch('videoUrl') && watch('videoUrl').includes('cloudinary') ? (
                                                    <div className="text-[#39FF14] flex flex-col items-center gap-2">
                                                        <Activity size={24} />
                                                        <p className="font-bold">¡Video subido correctamente!</p>
                                                        <button type="button" onClick={() => document.getElementById('video-upload')?.click()} className="text-xs underline text-slate-400 hover:text-white">Cambiar video</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-slate-400 text-sm mb-4">Sube tu archivo de video directamente (MP4, MOV)</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => document.getElementById('video-upload')?.click()}
                                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-all"
                                                        >
                                                            Seleccionar Archivo
                                                        </button>
                                                    </>
                                                )}
                                                <input
                                                    id="video-upload"
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    onChange={(e) => e.target.files && handleVideoUpload(e.target.files[0])}
                                                />
                                            </div>
                                        </InputGroup>
                                    ) : (
                                        <InputGroup label="Enlace de YouTube / Vimeo">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <LinkIcon className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <input
                                                    type="url"
                                                    {...register('videoUrl')}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#39FF14] transition-all placeholder:text-slate-600"
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                            </div>

                                            {/* Fallback Instruction */}
                                            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                                <div className="shrink-0">
                                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">i</div>
                                                </div>
                                                <div>
                                                    <h5 className="text-blue-400 font-bold text-sm mb-1">¿Video muy pesado?</h5>
                                                    <p className="text-slate-400 text-xs leading-relaxed">
                                                        Si tu archivo es muy grande (+100MB), te recomendamos subirlo a YouTube como <strong>"No Listado"</strong> y pegar el enlace aquí. Esto asegura que cargue rápido para todos.
                                                    </p>
                                                </div>
                                            </div>
                                        </InputGroup>
                                    )}
                                </div>
                            </motion.div>
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </div>
    );
};

export default CreatePlayerForm;
