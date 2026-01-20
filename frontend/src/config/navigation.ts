import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Settings,
    Inbox,
    Building2,
    Trophy,
    UserCircle,
    Search,
    Globe,
    Bookmark
} from 'lucide-react';

export const SUPERADMIN_NAV = [
    { title: 'Panel General', icon: LayoutDashboard, href: '/superadmin/dashboard' },
    { title: 'Usuarios & Accesos', icon: Users, href: '/superadmin/users' },
    // { title: 'Validaciones', icon: ShieldCheck, href: '/superadmin/approvals' },
    // { title: 'Configuración', icon: Settings, href: '/superadmin/settings' },
];

export const AGENT_NAV = [
    { title: 'Inicio', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Mi Plantel', icon: Users, href: '/dashboard/players' },
    { title: 'Scouting', icon: Search, href: '/dashboard/scouting' },
    { title: 'Configuracion', icon: Settings, href: '/dashboard/settings' },
];

export const PLAYER_NAV = [
    // { title: 'Mi Carrera', icon: Trophy, href: '/dashboard/player/home' },
    // { title: 'Editar Perfil', icon: UserCircle, href: '/dashboard/player/edit' },
    // { title: 'Buscar Representante', icon: Search, href: '/dashboard/player/search-agent' },
];

export const CLUB_NAV = [
    // { title: 'Mercado de Pases', icon: Globe, href: '/dashboard/club/market' },
    // { title: 'Mis Intereses', icon: Bookmark, href: '/dashboard/club/favorites' },
];

export const getNavByRole = (role: string | undefined) => {
    switch (role) {
        case 'superadmin': return SUPERADMIN_NAV;
        case 'agent': return AGENT_NAV;
        case 'player': return PLAYER_NAV;
        case 'club': return CLUB_NAV;
        default: return [];
    }
};
