import api from '@/services/api';

export interface Application {
    id: string;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
    createdAt: string;
    agent?: {
        id: string;
        agencyName: string;
    };
    player?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export const applicationsService = {
    create: async (agentId: string, message?: string) => {
        const { data } = await api.post('/applications', { agentId, message });
        return data;
    },

    findAllForPlayer: async () => {
        const { data } = await api.get<Application[]>('/applications/my');
        return data;
    },

    findAllForAgent: async () => {
        const { data } = await api.get<Application[]>('/applications/incoming');
        return data;
    },

    updateStatus: async (id: string, status: 'accepted' | 'rejected') => {
        const { data } = await api.patch(`/applications/${id}/status`, { status });
        return data;
    }
};
