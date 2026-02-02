import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
// Pages
import Attendance from './pages/attendance/Attendance';
import Learning from './pages/learning/Learning';
import Habits from './pages/habits/Habits';
import Roadmap from './pages/roadmap/Roadmap';
import Placement from './pages/placement/Placement';
import Profile from './pages/profile/Profile';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/auth/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';
import QuizHome from "./pages/quiz/QuizHome";
import QuizAttempt from "./pages/quiz/QuizAttempt";
import QuizResult from "./pages/quiz/QuizResult";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/placement" element={<Placement />} />
            <Route path="/profile" element={<Profile />} />

            {/* quiz routes date 3 feb */}
            <Route path="/quiz" element={<QuizHome />} />
    <Route path="/quiz/attempt" element={<QuizAttempt />} />
    <Route path="/quiz/result" element={<QuizResult />} />

            
            {/* Add other routes here later */}
          </Route>

          {/* Catch all - redirect to dashboard if auth, else login/landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
