// const QuizHome = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Quiz Home</h1>
//       <p>Topic selection will come here</p>
//     </div>
//   );
// };

// export default QuizHome;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizApi } from "../../api/quizApi";

const QuizHome = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await quizApi.generateQuiz(topic);

      // Save quiz data for next page
      localStorage.setItem("quizData", JSON.stringify(data));

      navigate("/quiz/attempt");
    } catch (err) {
      setError("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Start a Quiz</h1>

      <input
        type="text"
        placeholder="Enter topic (e.g. Recursion in DSA)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-3"
      />

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <button
        onClick={handleStartQuiz}
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Generating Quiz..." : "Start Quiz"}
      </button>
    </div>
  );
};

export default QuizHome;
