import api from "./api";

const RESOURCE = "/matches";

export const matchService = {
    getAll: async (filters = {}) => {
        const response = await api.get(RESOURCE, { params: filters });
        return response.data;
    },

    getById: async (idMatch) => {
        const response = await api.get(`${RESOURCE}/${idMatch}`);
        return response.data;
    },

    create: async (payload) => {
        const response = await api.post(RESOURCE, payload);
        return response.data;
    },

    update: async (idMatch, payload) => {
        const response = await api.put(`${RESOURCE}/${idMatch}`, payload);
        return response.data;
    },

    remove: async (idMatch) => {
        const response = await api.delete(`${RESOURCE}/${idMatch}`);
        return response.data;
    },
};

export default matchService;