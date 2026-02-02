// const QuizAttempt = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Quiz Attempt</h1>
//       <p>Questions will appear here</p>
//     </div>
//   );
// };

// export default QuizAttempt;
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const QuizAttempt = () => {
//   const navigate = useNavigate();

//   const [quizId, setQuizId] = useState(null);
//   const [questions, setQuestions] = useState(null); // ⬅️ IMPORTANT
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState([]);

//   useEffect(() => {
//     const storedQuiz = localStorage.getItem("quizData");

//     if (!storedQuiz) {
//       navigate("/quiz");
//       return;
//     }

//     try {
//       const parsed = JSON.parse(storedQuiz);

//       // 🔒 Validate shape
//       if (!parsed.questions || !Array.isArray(parsed.questions)) {
//         throw new Error("Invalid quiz data");
//       }

//       setQuizId(parsed.quizId);
//       setQuestions(parsed.questions);
//     } catch (err) {
//       console.error("Quiz load failed:", err);
//       navigate("/quiz");
//     }
//   }, [navigate]);

//   // 🛑 Guard render until questions are ready
//   if (!questions) {
//     return <p className="p-6">Loading questions...</p>;
//   }

//   const currentQuestion = questions[currentIndex];

//   const handleSelect = (optionIndex) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[currentIndex] = optionIndex;
//     setAnswers(updatedAnswers);
//   };

//   const handleNext = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <p className="text-sm text-gray-500 mb-2">
//         Question {currentIndex + 1} of {questions.length}
//       </p>

//       <h2 className="text-lg font-semibold mb-4">
//         {currentQuestion.question}
//       </h2>

//       <div className="space-y-2">
//         {currentQuestion.options.map((option, idx) => (
//           <button
//             key={idx}
//             onClick={() => handleSelect(idx)}
//             className={`w-full text-left px-4 py-2 border rounded-lg ${
//               answers[currentIndex] === idx
//                 ? "bg-primary/10 border-primary"
//                 : "hover:bg-gray-50"
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       <div className="flex justify-end mt-6">
//         {currentIndex < questions.length - 1 ? (
//           <button
//             onClick={handleNext}
//             className="bg-primary text-white px-6 py-2 rounded-lg"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={() => navigate("/quiz/result")}
//             className="bg-green-600 text-white px-6 py-2 rounded-lg"
//           >
//             Finish
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuizAttempt;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizApi } from "../../api/quizApi"; // ✅ ADD THIS

const QuizAttempt = () => {
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quizData");

    if (!storedQuiz) {
      navigate("/quiz");
      return;
    }

    try {
      const parsed = JSON.parse(storedQuiz);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid quiz data");
      }

      setQuizId(parsed.quizId);
      setQuestions(parsed.questions);
    } catch (err) {
      console.error("Quiz load failed:", err);
      navigate("/quiz");
    }
  }, [navigate]);

  if (!questions) {
    return <p className="p-6">Loading questions...</p>;
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const result = await quizApi.submitQuiz(quizId, answers);

      localStorage.setItem("quizResult", JSON.stringify(result));

      navigate("/quiz/result");
    } catch (error) {
      console.error("Quiz submission failed", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 mb-2">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <h2 className="text-lg font-semibold mb-4">
        {currentQuestion.question}
      </h2>

      <div className="space-y-2">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left px-4 py-2 border rounded-lg ${
              answers[currentIndex] === idx
                ? "bg-primary/10 border-primary"
                : "hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
