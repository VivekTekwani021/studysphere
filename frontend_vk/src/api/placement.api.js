import api from './axiosInstance';

// ============ APPLICATION APIs ============

export const applicationApi = {
    // Create new application
    create: async (data) => {
        const response = await api.post('/placement/applications', data);
        return response.data;
    },

    // Get my applications
    getMyApplications: async () => {
        const response = await api.get('/placement/applications/my');
        return response.data;
    },

    // Update application
    update: async (id, data) => {
        const response = await api.put(`/placement/applications/${id}`, data);
        return response.data;
    },

    // Delete application
    delete: async (id) => {
        const response = await api.delete(`/placement/applications/${id}`);
        return response.data;
    },

    // Add interview round
    addInterviewRound: async (id, data) => {
        const response = await api.post(`/placement/applications/${id}/interview`, data);
        return response.data;
    },

    // Admin: Get all applications
    getAllApplications: async () => {
        const response = await api.get('/placement/applications/admin/all');
        return response.data;
    },

    // Admin: Get selected students
    getSelectedStudents: async () => {
        const response = await api.get('/placement/applications/admin/selected');
        return response.data;
    },
};

// ============ ACTIVITY APIs ============

export const activityApi = {
    // Get all activities
    getAll: async (params = {}) => {
        const response = await api.get('/placement/activities', { params });
        return response.data;
    },

    // Create activity (Admin)
    create: async (data) => {
        const response = await api.post('/placement/activities', data);
        return response.data;
    },

    // Update activity (Admin)
    update: async (id, data) => {
        const response = await api.put(`/placement/activities/${id}`, data);
        return response.data;
    },

    // Delete activity (Admin)
    delete: async (id) => {
        const response = await api.delete(`/placement/activities/${id}`);
        return response.data;
    },

    // Register for activity
    register: async (id) => {
        const response = await api.post(`/placement/activities/${id}/register`);
        return response.data;
    },

    // Unregister from activity
    unregister: async (id) => {
        const response = await api.post(`/placement/activities/${id}/unregister`);
        return response.data;
    },
};

// Keep existing resume API for backward compatibility
export const placementApi = {
    getAll: async () => {
        const response = await api.get('/placement');
        return response.data;
    },
    apply: async (id) => {
        const response = await api.post(`/placement/${id}/apply`);
        return response.data;
    },
};
