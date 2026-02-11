import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/rooms';
const API_URL = `${import.meta.env.VITE_API_URL}/api/rooms`;


const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export const studyRoomApi = {
    // Create a new room
    createRoom: async (data) => {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    },

    // Get all active rooms
    getRooms: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },

    // Get user's created rooms
    getMyRooms: async () => {
        const response = await axios.get(`${API_URL}/my-rooms`, getAuthHeaders());
        return response.data;
    },

    // Get a specific room by ID
    getRoom: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Join by meeting ID and password
    joinByMeetingId: async (meetingId, password) => {
        const response = await axios.post(`${API_URL}/join`,
            { meetingId, password },
            getAuthHeaders()
        );
        return response.data;
    },

    // Join a room by ID
    joinRoom: async (id) => {
        const response = await axios.post(`${API_URL}/${id}/join`, {}, getAuthHeaders());
        return response.data;
    },

    // Leave a room
    leaveRoom: async (id) => {
        const response = await axios.post(`${API_URL}/${id}/leave`, {}, getAuthHeaders());
        return response.data;
    },

    // Close a room (host only)
    closeRoom: async (id) => {
        const response = await axios.post(`${API_URL}/${id}/close`, {}, getAuthHeaders());
        return response.data;
    },

    // Permanently delete a room (host only)
    deleteRoom: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Transfer host role
    transferHost: async (roomId, newHostId) => {
        const response = await axios.post(
            `${API_URL}/${roomId}/transfer-host`,
            { newHostId },
            getAuthHeaders()
        );
        return response.data;
    },

    // Regenerate room password (host only)
    regeneratePassword: async (id) => {
        const response = await axios.post(
            `${API_URL}/${id}/regenerate-password`,
            {},
            getAuthHeaders()
        );
        return response.data;
    },
};
