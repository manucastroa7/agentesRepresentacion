import { MessageCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
    const { toast } = useToast();
    const shareUrl = url || window.location.href;

    const handleWhatsAppShare = () => {
        const message = `Hola, te comparto el perfil de *${title}*. Míralo aquí: ${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: "Enlace copiado",
            description: "El enlace ha sido copiado al portapapeles.",
            variant: "success",
        });
    };

    return (
        <div className="flex gap-3">
            {/* WhatsApp Button */}
            <button
                onClick={handleWhatsAppShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20bd5a] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all duration-300 transform active:scale-95"
                title="Compartir en WhatsApp"
            >
                <MessageCircle size={20} />
                <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Copy Link Button */}
            <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-transparent text-slate-300 font-bold rounded-lg border border-white/20 hover:text-white hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all duration-300 transform active:scale-95"
                title="Copiar enlace"
            >
                <Copy size={20} />
                <span className="hidden sm:inline">Copiar</span>
            </button>
        </div>
    );
};

export default ShareButtons;
