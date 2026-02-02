// import api from "./axiosInstance";

// export const quizApi = {
//   generateQuiz: (topic) =>
//     api.post("/quiz/generate", { topic }),

//   submitQuiz: (quizId, answers) =>
//     api.post("/quiz/submit", { quizId, answers })
// };
import api from "./axiosInstance";

export const quizApi = {
  generateQuiz: async (topic) => {
    const response = await api.post("/quiz/generate", { topic });
    return response.data; // ✅ FIX
  },

  submitQuiz: async (quizId, answers) => {
    const response = await api.post("/quiz/submit", { quizId, answers });
    return response.data;
  }
};
