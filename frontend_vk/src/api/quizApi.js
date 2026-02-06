// import api from "./axiosInstance";

// export const quizApi = {
//   generateQuiz: (topic) =>
//     api.post("/quiz/generate", { topic }),

//   submitQuiz: (quizId, answers) =>
//     api.post("/quiz/submit", { quizId, answers })
// };
import api from "./axiosInstance";

export const quizApi = {
  generateQuiz: async (topic, difficulty = "medium") => {
    const response = await api.post("/quiz/generate", { topic, difficulty });
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    const response = await api.post("/quiz/submit", { quizId, answers });
    return response.data;
  }
};

