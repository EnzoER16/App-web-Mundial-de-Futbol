import api from "./api";

export const authService = {
    login: async (username, password) => {
        const response = await api.post("/auth/login", { username, password });
        return response.data; // { token, user }
    },

    register: async (payload) => {
        const response = await api.post("/auth/register", payload);
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    me: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },
};

export default authService;