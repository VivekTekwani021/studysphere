import api from './axiosInstance';

export const learningApi = {
    // Get AI content for a topic
    getContent: async (topic) => {
        const response = await api.post('/learning/content', { topic });
        return response.data;
    },

    // Mark topic as learned
    markLearned: async (topicId) => {
        const response = await api.post('/learning/complete', { topicId });
        return response.data;
    },

    // Generate quiz
    // generateQuiz: async (topic) => {
    //     const response = await api.post('/quiz/generate', { topic });
    //     return response.data;
    // },

    // // Submit quiz
    // submitQuiz: async (quizId, answers) => { // answers: { [questionId]: answerIndex }
    //     const response = await api.post('/quiz/submit', { quizId, answers });
    //     return response.data;
    // }
};
