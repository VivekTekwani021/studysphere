import api from './axiosInstance';

export const authApi = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    googleLogin: async (token) => {
        const response = await api.post('/auth/google', { token });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const onboardingApi = {
    complete: async (data) => {
        const response = await api.post('/onboarding/complete', data);
        return response.data;
    }
};
