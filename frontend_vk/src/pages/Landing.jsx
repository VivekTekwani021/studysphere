import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useAuth} from "../context/AuthContext"
const Landing = () => {
  const navigate=useNavigate();
  const { user, loading } = useAuth();
  if(user){
    navigate("/dashboard");
  }
   if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-primary">StudySphere</h1>
      <div className="space-x-4">
        <Link to="/login" className="px-4 py-2 bg-primary text-white rounded">Login</Link>
        <Link to="/register" className="px-4 py-2 bg-white border border-gray-300 rounded">Register</Link>
      </div>
    </div>
  );
};

export default Landing;
