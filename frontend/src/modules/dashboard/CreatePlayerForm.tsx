import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import { User, Activity, ImageIcon, Save, ChevronDown, Plus, Trash2, Upload, Lock, GripVertical } from 'lucide-react';
import MiniPitch from '@/components/soccer/MiniPitch';
import { useAuthStore } from '@/context/authStore';
import { Switch } from '@/components/ui/switch';
import InputGroup from './components/InputGroup';
import { API_BASE_URL } from '@/config/api';
import defaultAvatar from '@/assets/default_avatar.png';
import { SPORTS_CONFIG } from '../../config/sports.config';
import type { SportType } from '../../config/sports.config';

interface FormData {
    firstName: string;
    lastName: string;
    position: string[]; // Changed to array
    tacticalPoints?: Array<{ x: number; y: number; label?: string }>;
    careerHistory: Array<{ club: string; year: string }>;
    showCareerHistory: boolean;
    nationality: string;
    foot: string;
    height: string;
    weight: string;
    birthDate: string;
    avatarUrl: string;
    videoUrl: string;
    videoList: Array<{ url: string; title: string }>;
    status: string;
    club: string;
    marketValue: string;
    stats: {
        speed: number;
        physical: number;
        technique: number;
        tactical: number;
        shooting: number;
        passing: number;
    };
    additionalInfo: Array<{ label: string; value: string; isPublic: boolean }>;
    privateDetails: {
        contract: {
            expiryDate: { value: string; isPublic: boolean };
            releaseClause: { value: string; isPublic: boolean };
            annualSalary: { value: string; isPublic: boolean };
            coRepresented: { value: string; isPublic: boolean };
        };
        health: {
            injuryHistory: { value: string; isPublic: boolean };
            nutrition: { value: string; isPublic: boolean };
        };
        family: {
            familyNotes: { value: string; isPublic: boolean };
        };
        observations: {
            text: string;
            isPublic: boolean;
        };
    };
    passport: string;
    hasPassport: boolean;
    availability: string;
    hasClub: boolean;
    hasMarketValue: boolean;
    isMarketplaceVisible: boolean;
}

const CreatePlayerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            position: [],
            tacticalPoints: [],
            careerHistory: [],
            showCareerHistory: true,
            nationality: '',
            foot: '',
            height: '',
            weight: '',
            birthDate: '',
            avatarUrl: '',
            videoUrl: '',
            isMarketplaceVisible: true,
            status: 'signed',
            club: '',
            marketValue: '',
            stats: {
                speed: 50,
                physical: 50,
                technique: 50,
                tactical: 50,
                shooting: 50,
                passing: 50
            },
            additionalInfo: [],
            privateDetails: {
                contract: {
                    expiryDate: { value: '', isPublic: false },
                    releaseClause: { value: '', isPublic: false },
                    annualSalary: { value: '', isPublic: false },
                    coRepresented: { value: '', isPublic: false }
                },
                health: {
                    injuryHistory: { value: '', isPublic: false },
                    nutrition: { value: '', isPublic: false }
                },
                family: {
                    familyNotes: { value: '', isPublic: false }
                },
                observations: { text: '', isPublic: false }
            }
        }
    });

    useEffect(() => {
        if (id && token) {
            const fetchPlayer = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
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
                            additionalInfo: data.additionalInfo?.map((item: any) => ({
                                ...item,
                                isPublic: item.isPublic !== false // Default to true if undefined
                            })) || [],
                            careerHistory: data.careerHistory || [], // Ensure array logic
                            videoList: data.videoList && data.videoList.length > 0
                                ? data.videoList
                                : data.videoUrl ? [{ url: data.videoUrl, title: 'Highlight Principal' }] : [],
                            passport: data.passport || '',
                            hasPassport: !!data.passport,
                            availability: data.availability || 'DISPONIBLE',
                            hasClub: !!data.club,
                            hasMarketValue: !!data.marketValue,
                            isMarketplaceVisible: data.isMarketplaceVisible !== false, // Default to true if undefined
                            privateDetails: {
                                contract: {
                                    expiryDate: typeof data.privateDetails?.contract?.expiryDate === 'object'
                                        ? data.privateDetails.contract.expiryDate
                                        : { value: data.privateDetails?.contract?.expiryDate || '', isPublic: false },
                                    releaseClause: typeof data.privateDetails?.contract?.releaseClause === 'object'
                                        ? data.privateDetails.contract.releaseClause
                                        : { value: data.privateDetails?.contract?.releaseClause || '', isPublic: false },
                                    annualSalary: typeof data.privateDetails?.contract?.annualSalary === 'object'
                                        ? data.privateDetails.contract.annualSalary
                                        : { value: data.privateDetails?.contract?.annualSalary || '', isPublic: false },
                                    coRepresented: typeof data.privateDetails?.contract?.coRepresented === 'object'
                                        ? data.privateDetails.contract.coRepresented
                                        : { value: data.privateDetails?.contract?.coRepresented || '', isPublic: false }
                                },
                                health: {
                                    injuryHistory: typeof data.privateDetails?.health?.injuryHistory === 'object'
                                        ? data.privateDetails.health.injuryHistory
                                        : { value: data.privateDetails?.health?.injuryHistory || '', isPublic: false },
                                    nutrition: typeof data.privateDetails?.health?.nutrition === 'object'
                                        ? data.privateDetails.health.nutrition
                                        : { value: data.privateDetails?.health?.nutrition || '', isPublic: false }
                                },
                                family: {
                                    familyNotes: typeof data.privateDetails?.family?.familyNotes === 'object'
                                        ? data.privateDetails.family.familyNotes
                                        : { value: data.privateDetails?.family?.familyNotes || '', isPublic: false }
                                },
                                observations: typeof data.privateDetails?.observations === 'string'
                                    ? { text: data.privateDetails.observations, isPublic: false }
                                    : {
                                        text: data.privateDetails?.observations?.text || '',
                                        isPublic: data.privateDetails?.observations?.isPublic || false
                                    }
                            }
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

    const { fields: careerFields, append: appendCareer, remove: removeCareer, replace } = useFieldArray({
        control,
        name: "careerHistory"
    });

    const { fields: videoFields, append: appendVideo, remove: removeVideo } = useFieldArray({
        control,
        name: "videoList"
    });

    const [currentSport, setCurrentSport] = useState<SportType>('football');
    const sportConfig = SPORTS_CONFIG[currentSport] || SPORTS_CONFIG['football'];

    console.log('Current Sport:', currentSport);
    console.log('Sport Config:', sportConfig);

    const [activeTab, setActiveTab] = useState('personal');
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [videoSource, setVideoSource] = useState<'upload' | 'link'>('upload');

    // New Category State: 'squad' or 'scouting'
    // Initialize based on loaded data status
    const [category, setCategory] = useState<'squad' | 'scouting'>('squad');

    // Update category when data loads
    useEffect(() => {
        const currentStatus = watch('status');
        if (['watchlist', 'contacted', 'priority'].includes(currentStatus)) {
            setCategory('scouting');
        } else {
            setCategory('squad');
        }
    }, [watch('status')]);

    // Update status when category changes
    const handleCategoryChange = (newCategory: 'squad' | 'scouting') => {
        setCategory(newCategory);
        if (newCategory === 'squad') {
            setValue('status', 'signed');
            setValue('availability', 'DISPONIBLE');
        } else {
            setValue('status', 'watchlist');
            setValue('availability', 'DISPONIBLE'); // Default or irrelevant for scouting
        }
    };
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
            avatarUrl: data.avatarUrl || defaultAvatar,
            media: [],
            stats: data.stats,
            status: data.status,
            videoUrl: data.videoUrl,
            videoList: data.videoList, // Added videoList to payload
            careerHistory: data.careerHistory, // ✅ Fixed: Added missing field
            additionalInfo: data.additionalInfo,
            showCareerHistory: data.showCareerHistory,
            tacticalPoints: data.tacticalPoints,
            privateDetails: data.privateDetails,
            passport: data.hasPassport ? data.passport : null,
            availability: data.availability,
            club: data.hasClub ? data.club : null,
            marketValue: data.hasMarketValue ? data.marketValue : null,
            isMarketplaceVisible: data.isMarketplaceVisible
        };

        if (!token) {
            alert("Error: No estás autenticado.");
            return;
        }

        try {
            const url = id ? `${API_BASE_URL}/players/${id}` : `${API_BASE_URL}/players`;
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
            <div className="flex flex-col gap-4">
                {/* Sport Toggle Experiment */}
                <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-xl border border-white/5 w-fit self-end">
                    <span className="text-xs text-slate-500 uppercase font-bold px-2">Modo Deporte:</span>
                    {Object.entries(SPORTS_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setCurrentSport(key as SportType);
                                setValue('position', []); // Reset positions on switch
                                setValue('tacticalPoints', []);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentSport === key
                                ? 'bg-white text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">{id ? 'Editar Jugador' : 'Nuevo Jugador'}</h1>
                        <p className="text-slate-400 mt-1">{id ? 'Modifica la información del perfil.' : 'Completa la información para crear un nuevo perfil.'}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-white/5">
                            <span className="text-sm font-bold text-slate-300">Visible en Portfolio</span>
                            <Controller
                                name="isMarketplaceVisible"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-[#39FF14]"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('squad')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${category === 'squad' ? 'bg-[#39FF14] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                PLANTEL
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('scouting')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${category === 'scouting' ? 'bg-[#39FF14] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                SCOUTING
                            </button>
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
                </div>
            </div>

            {/* Main Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">

                    {/* Tabs Header */}
                    <Tabs.List className="flex border-b border-white/5 bg-slate-950/50 px-6 pt-2">
                        {[
                            { id: 'personal', label: 'Datos Personales', icon: User },
                            // { id: 'technical', label: 'Perfil Técnico', icon: Activity },
                            { id: 'multimedia', label: 'Multimedia', icon: ImageIcon },
                            { id: 'private', label: 'Información Adicional', icon: Lock },
                        ].map((tab) => (
                            <Tabs.Trigger
                                key={tab.id}
                                value={tab.id}
                                className={`
                                        group flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all
                                        ${activeTab === tab.id
                                        ? tab.id === 'private'
                                            ? 'border-orange-500 text-orange-500'
                                            : 'border-[#39FF14] text-[#39FF14]'
                                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/10'}
                                    `}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? (tab.id === 'private' ? 'text-orange-500' : 'text-[#39FF14]') : 'text-slate-500 group-hover:text-slate-300'} />
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



                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">{sportConfig.terminology.club} Actual</label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('hasClub')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-500">¿Tiene?</span>
                                                </label>
                                            </div>
                                            {watch('hasClub') && (
                                                <input
                                                    {...register('club')}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all placeholder:text-slate-600"
                                                    placeholder="Ej: Boca Juniors"
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">Valor de Mercado</label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('hasMarketValue')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-500">¿Visible?</span>
                                                </label>
                                            </div>
                                            {watch('hasMarketValue') && (
                                                <input
                                                    {...register('marketValue')}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all placeholder:text-slate-600"
                                                    placeholder="Ej: $ 1.5M"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <InputGroup label="Posiciones de Juego">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Position Selection */}
                                            <div className="space-y-4">
                                                <Accordion.Root type="multiple" className="space-y-2">
                                                    {Object.entries(sportConfig.positions).map(([category, positions]) => (
                                                        <Accordion.Item key={category} value={category} className="bg-slate-900/30 border border-white/5 rounded-xl overflow-hidden">
                                                            <Accordion.Header>
                                                                <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors group data-[state=open]:text-[#39FF14]">
                                                                    {category}
                                                                    <ChevronDown className="text-slate-500 group-hover:text-white transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#39FF14]" size={16} />
                                                                </Accordion.Trigger>
                                                            </Accordion.Header>
                                                            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                                                <div className="p-4 grid grid-cols-2 gap-2 border-t border-white/5 bg-slate-950/30">
                                                                    {positions.map((pos) => {
                                                                        const currentPositions = watch('position') || [];
                                                                        const isSelected = currentPositions.includes(pos);
                                                                        return (
                                                                            <button
                                                                                key={pos}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const newPositions = isSelected
                                                                                        ? currentPositions.filter(p => p !== pos)
                                                                                        : [...currentPositions, pos];
                                                                                    setValue('position', newPositions);
                                                                                }}
                                                                                className={`
                                                                                    px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border
                                                                                    ${isSelected
                                                                                        ? 'bg-[#39FF14] text-slate-950 border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                                                                                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                                                                                    }
                                                                                `}
                                                                            >
                                                                                {pos}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </Accordion.Content>
                                                        </Accordion.Item>
                                                    ))}
                                                </Accordion.Root>
                                            </div>

                                            {/* Pitch Visualizer */}
                                            <div className="flex flex-col items-center justify-center">
                                                <MiniPitch
                                                    positions={watch('position') || []}
                                                    customPoints={watch('tacticalPoints') || []}
                                                    interactive={true}
                                                    onPointClick={(x, y) => {
                                                        const currentPoints = watch('tacticalPoints') || [];
                                                        // Limit to e.g. 3 points or just append
                                                        setValue('tacticalPoints', [...currentPoints, { x, y }]);
                                                    }}
                                                />
                                                <div className="flex flex-col items-center mt-3 gap-2">
                                                    <p className="text-slate-500 text-xs text-center italic">
                                                        Haz clic en el campo para marcar la posición exacta.
                                                    </p>
                                                    {(watch('tacticalPoints') || []).length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setValue('tacticalPoints', [])}
                                                            className="text-xs text-red-400 hover:text-red-300 underline"
                                                        >
                                                            Limpiar posiciones manuales
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </InputGroup>
                                </div>

                                <div className="space-y-6">
                                    <InputGroup label={sportConfig.terminology.dominantLimb.label}>
                                        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
                                            {sportConfig.terminology.dominantLimb.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`
                                                            flex-1 flex items-center justify-center py-2 rounded-lg cursor-pointer transition-all text-sm font-medium
                                                            ${watch('foot') === option.value
                                                            ? 'bg-slate-800 text-white shadow-lg'
                                                            : 'text-slate-500 hover:text-slate-300'}
                                                        `}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={option.value}
                                                        {...register('foot')}
                                                        className="hidden"
                                                    />
                                                    {option.label}
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">Pasaporte</label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('hasPassport')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-500">¿Tiene?</span>
                                                </label>
                                            </div>
                                            {watch('hasPassport') && (
                                                <input
                                                    {...register('passport')}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all placeholder:text-slate-600"
                                                    placeholder="Ej: Italiano / Comunitario"
                                                />
                                            )}
                                        </div>

                                        {category === 'squad' ? (
                                            <InputGroup label="Estado / Disponibilidad">
                                                <div className="relative">
                                                    <select
                                                        {...register('availability')}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#39FF14] transition-all"
                                                    >
                                                        <option value="DISPONIBLE">🟢 DISPONIBLE</option>
                                                        <option value="NO DISPONIBLE">🔴 NO DISPONIBLE</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                                </div>
                                            </InputGroup>
                                        ) : (
                                            <InputGroup label="Estado de Scouting">
                                                <div className="relative">
                                                    <select
                                                        {...register('status')}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#39FF14] transition-all"
                                                    >
                                                        <option value="watchlist">👁️ Observando</option>
                                                        <option value="contacted">💬 Contactado</option>
                                                        <option value="priority">🎯 Objetivo Prioritario</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                                </div>
                                            </InputGroup>
                                        )}
                                    </div>

                                    {/* Career History Section */}
                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">Trayectoria / Historial de Clubes</label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('showCareerHistory')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Mostrar en perfil público</span>
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => appendCareer({ club: '', year: '' })}
                                                className="text-[#39FF14] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Agregar Club
                                            </button>
                                        </div>

                                        <Reorder.Group axis="y" values={careerFields} onReorder={replace} className="space-y-3">
                                            {careerFields.map((field, index) => (
                                                <Reorder.Item
                                                    key={field.id}
                                                    value={field}
                                                    whileDrag={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.3)", zIndex: 50 }}
                                                    className="group bg-slate-900/50 border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-white/10 transition-all cursor-grab active:cursor-grabbing"
                                                >
                                                    {/* Drag Handle */}
                                                    <div className="pr-3 border-r border-white/5 text-slate-600 group-hover:text-slate-400 transition-colors">
                                                        <GripVertical size={20} />
                                                    </div>

                                                    {/* Inputs Container */}
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="sm:col-span-2">
                                                            <input
                                                                {...register(`careerHistory.${index}.club` as const, { required: true })}
                                                                placeholder="Club / Equipo"
                                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#39FF14] outline-none transition-colors"
                                                            />
                                                        </div>
                                                        <div>
                                                            <input
                                                                {...register(`careerHistory.${index}.year` as const, { required: true })}
                                                                placeholder="Temporada (Ej: 2023)"
                                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#39FF14] outline-none transition-colors"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Delete Action */}
                                                    <div className="pl-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCareer(index)}
                                                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Eliminar registro"
                                                            onPointerDown={(e) => e.stopPropagation()}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                            {careerFields.length === 0 && (
                                                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-slate-900/30">
                                                    <p className="text-slate-500 text-sm">No hay clubes registrados.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => appendCareer({ club: '', year: '' })}
                                                        className="mt-2 text-[#39FF14] text-xs font-bold uppercase hover:underline"
                                                    >
                                                        Agregar el primer club
                                                    </button>
                                                </div>
                                            )}
                                        </Reorder.Group>
                                    </div>


                                </div>
                            </motion.div>
                        </Tabs.Content>

                        {/* --- TAB 2: TECHNICAL PROFILE (HIDDEN) --- */}
                        {/* 
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
                        */}

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
                                        <div className="space-y-4">
                                            {videoFields.map((field, index) => (
                                                <div key={field.id} className="relative bg-slate-900/50 p-4 rounded-xl border border-white/5 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-bold text-[#39FF14] uppercase">Video {index + 1}</span>
                                                        <button type="button" onClick={() => removeVideo(index)} className="text-slate-500 hover:text-red-500 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="md:col-span-1">
                                                            <input
                                                                {...register(`videoList.${index}.title`)}
                                                                placeholder="Título (ej: 2024)"
                                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#39FF14] focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <input
                                                                {...register(`videoList.${index}.url`, { required: 'URL requerida' })}
                                                                placeholder="https://youtube.com/..."
                                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#39FF14] focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => appendVideo({ url: '', title: '' })}
                                                className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-[#39FF14]/50 hover:bg-[#39FF14]/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
                                                AGREGAR LINK DE VIDEO
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </Tabs.Content>

                        {/* --- TAB 4: PRIVATE CRM --- */}
                        <Tabs.Content value="private" className="outline-none focus:outline-none">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Custom Additional Info Fields (Moved from Personal) */}
                                <p className="text-slate-400 text-sm mb-4">
                                    Agrega campos personalizados a la ficha del jugador (ej: Pasaporte, Apodo, Sponsorship) y decide cual mostrar públicamente.
                                </p>
                                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mb-8">
                                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[#39FF14] rounded-full"></span>
                                            Campos Personalizados (Pública/Privada)
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => append({ label: '', value: '', isPublic: true })}
                                            className="text-[#39FF14] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Agregar Dato
                                        </button>
                                    </h3>

                                    <div className="space-y-3">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2">
                                                <input
                                                    {...register(`additionalInfo.${index}.label` as const, { required: true })}
                                                    placeholder="Ej: Vencimiento Pasaporte"
                                                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#39FF14] outline-none"
                                                />
                                                <input
                                                    {...register(`additionalInfo.${index}.value` as const, { required: true })}
                                                    placeholder="Ej: 12/2026"
                                                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#39FF14] outline-none"
                                                />
                                                <label className="flex items-center gap-2 bg-slate-800 border border-white/20 rounded-lg px-3 cursor-pointer hover:bg-slate-700 transition-colors py-2 shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        {...register(`additionalInfo.${index}.isPublic` as const)}
                                                        className="w-5 h-5 cursor-pointer accent-[#39FF14]"
                                                    />
                                                    <span className="text-xs text-white font-bold uppercase select-none">Público</span>
                                                </label>
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
                                            <p className="text-slate-500 text-sm italic">
                                                Agrega datos personalizados que desees mostrar en el perfil público (opcional).
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Contract Section */}
                                <div className="bg-red-950/5 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        Contratos (Privado)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Vencimiento de Contrato">
                                            <div className="space-y-2">
                                                <input
                                                    type="date"
                                                    {...register('privateDetails.contract.expiryDate.value')}
                                                    className="w-full bg-slate-950 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all [color-scheme:dark]"
                                                />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('privateDetails.contract.expiryDate.isPublic')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Hacer público</span>
                                                </label>
                                            </div>
                                        </InputGroup>
                                        <InputGroup label="Cláusula de Salida (USD)">
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="text-slate-500 font-bold">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        {...register('privateDetails.contract.releaseClause.value')}
                                                        className="w-full bg-slate-950 border border-red-500/20 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all"
                                                        placeholder="5000000"
                                                    />
                                                </div>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('privateDetails.contract.releaseClause.isPublic')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Hacer público</span>
                                                </label>
                                            </div>
                                        </InputGroup>
                                        <InputGroup label="Salario Anual (USD)">
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="text-slate-500 font-bold">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        {...register('privateDetails.contract.annualSalary.value')}
                                                        className="w-full bg-slate-950 border border-red-500/20 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all"
                                                        placeholder="500000"
                                                    />
                                                </div>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('privateDetails.contract.annualSalary.isPublic')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Hacer público</span>
                                                </label>
                                            </div>
                                        </InputGroup>
                                        <InputGroup label="Empresa Co-Representante">
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    {...register('privateDetails.contract.coRepresented.value')}
                                                    className="w-full bg-slate-950 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all"
                                                    placeholder="Ej: XYZ Management"
                                                />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('privateDetails.contract.coRepresented.isPublic')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Hacer público</span>
                                                </label>
                                            </div>
                                        </InputGroup>
                                    </div>
                                </div>

                                {/* Health Section */}
                                <div className="bg-red-950/5 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        Salud & Físico
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Historial de Lesiones">
                                            <div className="space-y-2">
                                                <textarea
                                                    {...register('privateDetails.health.injuryHistory.value')}
                                                    rows={4}
                                                    className="w-full bg-slate-950 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-slate-600"
                                                    placeholder="Ej: Lesión de menisco en 2022, recuperación total..."
                                                />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('privateDetails.health.injuryHistory.isPublic')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Hacer público</span>
                                                </label>
                                            </div>
                                        </InputGroup>
                                        <InputGroup label="Nutrición / Dietas">
                                            <div className="space-y-2">
                                                <textarea
                                                    {...register('privateDetails.health.nutrition.value')}
                                                    rows={4}
                                                    className="w-full bg-slate-950 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-slate-600"
                                                    placeholder="Ej: Dieta alta en proteínas, intolerancia a..."
                                                />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register('privateDetails.health.nutrition.isPublic')}
                                                        className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                    />
                                                    <span className="text-xs text-slate-400">Hacer público</span>
                                                </label>
                                            </div>
                                        </InputGroup>
                                    </div>
                                </div>

                                {/* Family & Environment Section */}
                                <div className="bg-red-950/5 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        Entorno & Familia
                                    </h3>
                                    <InputGroup label="Situación Familiar / Entorno">
                                        <div className="space-y-2">
                                            <textarea
                                                {...register('privateDetails.family.familyNotes.value')}
                                                rows={4}
                                                className="w-full bg-slate-950 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-slate-600"
                                                placeholder="Ej: Padres presentes, hermano menor juega fútbol, tiene pasaporte italiano..."
                                            />
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    {...register('privateDetails.family.familyNotes.isPublic')}
                                                    className="w-4 h-4 rounded border-slate-600 text-[#39FF14] focus:ring-[#39FF14] bg-slate-900"
                                                />
                                                <span className="text-xs text-slate-400">Hacer público</span>
                                            </label>
                                        </div>
                                    </InputGroup>
                                </div>

                                {/* General Observations Section */}
                                <div className="bg-red-950/5 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Observaciones Generales
                                        </div>
                                        <label className="flex items-center gap-2 bg-slate-800 border border-white/20 rounded-lg px-3 cursor-pointer hover:bg-slate-700 transition-colors py-2">
                                            <input
                                                type="checkbox"
                                                {...register('privateDetails.observations.isPublic')}
                                                className="w-5 h-5 cursor-pointer accent-[#39FF14]"
                                            />
                                            <span className="text-xs text-white font-bold uppercase select-none">Hacer Público</span>
                                        </label>
                                    </h3>
                                    <textarea
                                        {...register('privateDetails.observations.text')}
                                        rows={6}
                                        className="w-full bg-slate-950 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-slate-600"
                                        placeholder="Notas adicionales, recordatorios, aspectos importantes a considerar..."
                                    />
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
