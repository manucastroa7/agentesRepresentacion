import api from '@/services/api';

export interface PublicAgent {
    id: string;
    agencyName: string;
    logo?: string;
    slug: string;
    location?: string;
    bio?: string;
}

export const agentsService = {
    findAll: async () => {
        const { data } = await api.get<PublicAgent[]>('/public/agents');
        return data;
    },

    getBySlug: async (slug: string) => {
        const { data } = await api.get(`/public/agents/${slug}`);
        return data;
    }
};
