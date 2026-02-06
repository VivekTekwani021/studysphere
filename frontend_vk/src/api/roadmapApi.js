import api from "./axiosInstance";

export const roadmapApi = {
    // Generate a new roadmap
    generateRoadmap: async (topic, duration, level) => {
        const response = await api.post("/roadmap/generate", { topic, duration, level });
        return response.data;
    },

    // Get active (full) roadmap with all days
    getActiveRoadmap: async () => {
        const response = await api.get("/roadmap/active");
        return response.data;
    },

    // Get today's tasks and backlog
    getTodayTasks: async () => {
        const response = await api.get("/roadmap/today");
        return response.data;
    },

    // Mark a task as complete
    completeTask: async (roadmapId, dayId, taskId) => {
        const response = await api.post("/roadmap/complete", { roadmapId, dayId, taskId });
        return response.data;
    }
};
