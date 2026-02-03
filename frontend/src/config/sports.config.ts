import { Share2, Activity, Target } from 'lucide-react';

export type SportType = 'football' | 'basketball' | 'field_hockey' | 'volleyball';

export interface SportConfig {
    label: string;
    positions: Record<string, string[]>;
    terminology: {
        player: string;
        club: string;
        dominantLimb: {
            label: string;
            options: { label: string; value: string }[];
        };
        heightUnit: string;
        weightUnit: string;
    };
    stats: {
        label: string;
        key: string;
        icon?: any;
    }[];
}

export const SPORTS_CONFIG: Record<SportType, SportConfig> = {
    football: {
        label: 'Fútbol',
        positions: {
            'Portero': ['Portero'],
            'Defensa': ['Lateral derecho', 'Central derecho', 'Central izquierdo', 'Lateral izquierdo'],
            'Mediocampista': ['Volante por derecha', 'Volante central', 'Volante izquierdo', 'Enganche'],
            'Delantero': ['Extremo derecho', 'Media Punta', 'Extremo izquierdo', 'Delantero Centro']
        },
        terminology: {
            player: 'Jugador',
            club: 'Club',
            dominantLimb: {
                label: 'Pie Hábil',
                options: [
                    { label: 'Diestro', value: 'right' },
                    { label: 'Zurdo', value: 'left' },
                    { label: 'Ambidextro', value: 'both' }
                ]
            },
            heightUnit: 'cm',
            weightUnit: 'kg'
        },
        stats: [
            { label: 'Goles', key: 'goals', icon: Target },
            { label: 'Asistencias', key: 'assists', icon: Share2 }
        ]
    },
    basketball: {
        label: 'Basquet',
        positions: {
            'Guards': ['Base (PG)', 'Escolta (SG)'],
            'Forwards': ['Alero (SF)', 'Ala-Pívot (PF)'],
            'Centers': ['Pívot (C)']
        },
        terminology: {
            player: 'Jugador',
            club: 'Equipo',
            dominantLimb: {
                label: 'Mano Hábil',
                options: [
                    { label: 'Diestra', value: 'right' },
                    { label: 'Zurda', value: 'left' }
                ]
            },
            heightUnit: 'cm',
            weightUnit: 'kg'
        },
        stats: [
            { label: 'PPG', key: 'ppg', icon: Activity }, // Points Per Game
            { label: 'RPG', key: 'rpg', icon: Activity }, // Rebounds Per Game
            { label: 'APG', key: 'apg', icon: Activity }  // Assists Per Game
        ]
    },
    field_hockey: {
        label: 'Hockey',
        positions: {
            'Defensa': ['Defensor Central', 'Lateral'],
            'Medio': ['Medio Centro', 'Volante'],
            'Delantero': ['Delantero']
        },
        terminology: {
            player: 'Jugador',
            club: 'Club',
            dominantLimb: {
                label: 'Stick',
                options: [
                    { label: 'Derecho', value: 'right' },
                    { label: 'Izquierdo', value: 'left' }
                ]
            },
            heightUnit: 'cm',
            weightUnit: 'kg'
        },
        stats: [
            { label: 'Goles', key: 'goals', icon: Target }
        ]
    },
    volleyball: {
        label: 'Voley',
        positions: {
            'General': ['Armador', 'Opuesto', 'Punta', 'Central', 'Líbero']
        },
        terminology: {
            player: 'Jugador',
            club: 'Club',
            dominantLimb: {
                label: 'Mano Hábil',
                options: [
                    { label: 'Diestra', value: 'right' },
                    { label: 'Zurda', value: 'left' }
                ]
            },
            heightUnit: 'cm',
            weightUnit: 'kg'
        },
        stats: []
    }
};
