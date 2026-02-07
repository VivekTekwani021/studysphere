// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import Layout from './components/layout/Layout';
// // Pages
// import Attendance from './pages/attendance/Attendance';
// //import Learning from './pages/learning/Learning';
// import Habits from './pages/habits/Habits';
// import Roadmap from './pages/roadmap/Roadmap';
// import Placement from './pages/placement/Placement';
// import Profile from './pages/profile/Profile';
// import Landing from './pages/Landing';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Onboarding from './pages/auth/Onboarding';
// import Dashboard from './pages/dashboard/Dashboard';
// import QuizHome from "./pages/quiz/QuizHome";
// import QuizAttempt from "./pages/quiz/QuizAttempt";
// import QuizResult from "./pages/quiz/QuizResult";
// import LearningRoom from "./pages/LearningRoom";


// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Toaster position="top-right" />
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/onboarding" element={<Onboarding />} />

//           <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/attendance" element={<Attendance />} />
//            <Route path="/learning" element={<LearningRoom />} />

//             <Route path="/habits" element={<Habits />} />
//             <Route path="/roadmap" element={<Roadmap />} />
//             <Route path="/placement" element={<Placement />} />
//             <Route path="/profile" element={<Profile />} />

//             {/* quiz routes date 3 feb */}
//             <Route path="/quiz" element={<QuizHome />} />
//     <Route path="/quiz/attempt" element={<QuizAttempt />} />
//     <Route path="/quiz/result" element={<QuizResult />} />


//             {/* Add other routes here later */}
//           </Route>

//           {/* Catch all - redirect to dashboard if auth, else login/landing */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Attendance from './pages/attendance/Attendance';
//import Roadmap from './pages/roadmap/RoadmapPage';
import Placement from './pages/placement/Placement';
import Profile from './pages/profile/Profile';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/auth/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';

// Quiz (unchanged)
import QuizHome from './pages/quiz/QuizHome';
import QuizAttempt from './pages/quiz/QuizAttempt';
import QuizResult from './pages/quiz/QuizResult';

// ✅ NEW LEARNING PAGES
import LearningRoom from './pages/learning/LearningRoom';
import LearningContent from './pages/learning/LearningContent';
import YouTubeLearning from './pages/learning/YouTubeLearning';
import GeneratePDF from './pages/learning/GeneratePDF';

// ✅ ROADMAP PAGE
import RoadmapPage from './pages/roadmap/RoadmapPage';

// ✅ RESUME SCORER (Career Catalyst)
import ResumeScorer from './pages/placement/ResumeScorer';

// ✅ STUDY ROOMS (Collaborative Learning)
import StudyRooms from './pages/studyroom/StudyRooms';
import StudyRoomView from './pages/studyroom/StudyRoomView';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* 🔐 Protected Routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />

              {/* 📚 LEARNING FLOW (CLEAN & SEPARATED) */}
              <Route path="/learning" element={<LearningRoom />} />
              <Route path="/learning/content" element={<LearningContent />} />
              <Route path="/learning/youtube" element={<YouTubeLearning />} />
              <Route path="/learning/pdf" element={<GeneratePDF />} />


              {/* 🗺️ Roadmap Route */}
              <Route path="/roadmap" element={<RoadmapPage />} />

              <Route path="/placement" element={<Placement />} />
              <Route path="/placement/resume" element={<ResumeScorer />} />
              <Route path="/profile" element={<Profile />} />

              {/* 🧠 Quiz Routes (unchanged) */}
              <Route path="/quiz" element={<QuizHome />} />
              <Route path="/quiz/attempt" element={<QuizAttempt />} />
              <Route path="/quiz/result" element={<QuizResult />} />

              {/* 👥 Study Rooms (Collaborative) */}
              <Route path="/study-rooms" element={<StudyRooms />} />
              <Route path="/study-rooms/:id" element={<StudyRoomView />} />


            </Route>

            {/* ❌ Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
