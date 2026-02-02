// const QuizResult = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Quiz Result</h1>
//       <p>Score & explanations will appear here</p>
//     </div>
//   );
// };

// export default QuizResult;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("quizResult");

    if (!storedResult) {
      navigate("/quiz");
      return;
    }

    setResult(JSON.parse(storedResult));
  }, [navigate]);

  if (!result) {
    return <p className="p-6">Loading results...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>

      <div className="mb-6">
        <p className="text-lg">Score: <b>{result.score}</b></p>
        <p className="text-lg">Accuracy: <b>{result.accuracy}%</b></p>
        <p className="text-lg">
          Mastery Status: <b>{result.masteryStatus}</b>
        </p>
      </div>

      {result.wrongAnswers?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">
            Review Your Mistakes
          </h2>

          <div className="space-y-4">
            {result.wrongAnswers.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <p className="font-medium mb-1">
                  {item.question}
                </p>
                <p className="text-sm text-red-600">
                  Your Answer Index: {item.yourAnswer}
                </p>
                <p className="text-sm text-green-600">
                  Correct Answer Index: {item.correctAnswer}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  💡 {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("quizData");
          localStorage.removeItem("quizResult");
          navigate("/quiz");
        }}
        className="mt-8 bg-primary text-white px-6 py-2 rounded-lg"
      >
        Start New Quiz
      </button>
    </div>
  );
};

export default QuizResult;

