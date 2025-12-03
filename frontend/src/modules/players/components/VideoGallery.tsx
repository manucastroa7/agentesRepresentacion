import React, { useState } from 'react';
import { Trash2, Upload, Play, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../context/authStore';
import { API_BASE_URL } from '@/config/api';

interface Video {
    id: string;
    title: string;
    url: string;
    publicId: string;
}

interface VideoGalleryProps {
    playerId: string;
    videos: Video[];
    onVideoUploaded: () => void;
    onVideoDeleted: () => void;
}

const MAX_SIZE_MB = 100;

export const VideoGallery: React.FC<VideoGalleryProps> = ({ playerId, videos, onVideoUploaded, onVideoDeleted }) => {
    const { token } = useAuthStore();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [videoTitle, setVideoTitle] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setUploadError(`El video es muy pesado (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo ${MAX_SIZE_MB}MB.`);
            return;
        }

        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('playerId', playerId);
        formData.append('title', videoTitle || file.name.replace(/\.[^/.]+$/, ""));

        try {
            const response = await fetch(`${API_BASE_URL}/players/videos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al subir el video');
            }

            setVideoTitle('');
            onVideoUploaded();
        } catch (err: any) {
            console.error(err);
            setUploadError(err.message || 'Error al subir el video');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (videoId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este video?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/players/videos/${videoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar el video');
            onVideoDeleted();
        } catch (err) {
            console.error(err);
            alert('No se pudo eliminar el video');
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Upload size={20} className="text-[#39FF14]" />
                    Subir Nuevo Video
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Título del Video (Opcional)</label>
                        <input
                            type="text"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="Ej: Gol contra Boca Juniors"
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                    </div>

                    <div className="relative group">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className={`border-2 border-dashed border-white/20 rounded-xl p-8 text-center transition-colors ${uploading ? 'bg-slate-900/50' : 'group-hover:border-[#39FF14]/50 group-hover:bg-slate-900/50'}`}>
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-slate-300 font-medium">Subiendo y procesando en la nube...</span>
                                    <span className="text-xs text-slate-500">Esto puede tomar unos minutos dependiendo de tu conexión.</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="text-slate-400 group-hover:text-[#39FF14] transition-colors" size={32} />
                                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Haz clic o arrastra un video aquí</span>
                                    <span className="text-xs text-slate-500">Máximo {MAX_SIZE_MB}MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {uploadError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 text-red-400 text-sm">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold mb-1">Error al subir</p>
                                <p>{uploadError}</p>
                                {uploadError.includes('pesado') && (
                                    <a
                                        href="https://www.freeconvert.com/video-compressor"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-2 text-[#39FF14] hover:underline"
                                    >
                                        Comprimir Video Online &rarr;
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div key={video.id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden group">
                        <div className="aspect-video bg-black relative">
                            <video
                                controls
                                className="w-full h-full object-cover"
                                poster={video.url.replace(/\.[^/.]+$/, ".jpg")} // Cloudinary thumbnail trick
                            >
                                <source src={video.url} type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                        <div className="p-4 flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-white font-bold line-clamp-1" title={video.title}>{video.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">Video subido</p>
                            </div>
                            <button
                                onClick={() => handleDelete(video.id)}
                                className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                title="Eliminar video"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {videos.length === 0 && !uploading && (
                <div className="text-center py-12 text-slate-500">
                    <Play size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay videos subidos aún.</p>
                </div>
            )}
        </div>
    );
};
