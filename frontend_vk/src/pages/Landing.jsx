import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  Video,
  HelpCircle,
  Map,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Users
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const features = [
    {
      icon: <CalendarCheck className="w-8 h-8 text-emerald-400" />,
      title: "Smart Attendance",
      description: "Track your daily attendance with ease. Get detailed analytics for both school and college modes."
    },
    {
      icon: <Video className="w-8 h-8 text-blue-400" />,
      title: "Collaborative Study Rooms",
      description: "Join real-time video study rooms. Share screens, chat, and learn together with peers globally."
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-purple-400" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with AI-generated quizzes. Instant feedback to help you master any subject."
    },
    {
      icon: <Map className="w-8 h-8 text-orange-400" />,
      title: "AI Learning Roadmap",
      description: "Get personalized learning paths tailored to your goals. Step-by-step guidance to success."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-pink-400" />,
      title: "Resume Analyzer",
      description: "Boost your career with AI-powered resume scoring. Get actionable insights to land your dream job."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
      title: "Learning Hub",
      description: "Centralized resource center for all your study materials, notes, and references."
    }
  ];

  const stats = [
    { number: "10k+", label: "Active Students" },
    { number: "500+", label: "Study Rooms" },
    { number: "1M+", label: "Quizzes Taken" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 max-w-7xl mx-auto left-0 right-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            StudySphere
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-slate-300 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats" className="hover:text-white transition-colors">Impact</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 rounded-full text-slate-300 hover:text-white font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-medium transition-all shadow-lg shadow-indigo-500/30">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium text-sm mb-6">
              🚀 Elevate Your Learning Experience
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Master Your Future with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                Intelligent Learning
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The all-in-one platform for students to track attendance, collaborate in real-time study rooms,
              and boost career prospects with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                Start Learning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-700 transition-all flex items-center justify-center">
                Explore Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-12 border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need to Excel</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Powerful tools designed to streamline your academic journey and prepare you for your professional career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all group"
              >
                <div className="bg-slate-900 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech/Trust Badge Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 font-semibold uppercase tracking-widest mb-10">Trusted by students worldwide</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos if needed, or just icons representing tech */}
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-300"><Shield className="w-8 h-8" /> Secure</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-300"><Zap className="w-8 h-8" /> Fast</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-300"><Users className="w-8 h-8" /> Community</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Transform Your Learning?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of students who are already using StudySphere to achieve their academic and career goals.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-2xl">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">StudySphere</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 StudySphere. All rights reserved. Built with ❤️ for students.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
