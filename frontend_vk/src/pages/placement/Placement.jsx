import React, { useState, useEffect } from 'react';
import { placementApi } from '../../api/placement.api';
import Card, { CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Briefcase, Building, MapPin, FileText, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate, Link } from 'react-router-dom';
import { clsx } from 'clsx';

const Placement = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.isPlacementEnabled) {
      fetchOpportunities();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      const response = await placementApi.getAll();
      if (response.success) {
        setOpportunities(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      const response = await placementApi.apply(id);
      if (response.success) {
        toast.success('Applied successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  // Allow all college students to access placement
  if (user?.educationLevel !== 'College') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={clsx("min-h-screen p-6", isDark ? "bg-slate-900" : "bg-slate-50")}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
          Career Catalyst
        </h1>
        <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          Kickstart your career with AI tools and opportunities
        </p>
      </div>

      {/* AI Tools Section */}
      <div className="mb-8">
        <h2 className={clsx("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
          AI-Powered Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Resume Scorer Card */}
          <Link to="/placement/resume">
            <div className={clsx(
              "group relative overflow-hidden rounded-2xl border p-6 transition-all cursor-pointer hover:shadow-xl",
              isDark
                ? "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/40"
                : "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 hover:border-violet-400"
            )}>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className={clsx(
                  "w-5 h-5 transition-transform group-hover:translate-x-1",
                  isDark ? "text-violet-400" : "text-violet-500"
                )} />
              </div>
              <h3 className={clsx("text-xl font-bold mt-4", isDark ? "text-white" : "text-slate-900")}>
                Resume Scorer
              </h3>
              <p className={clsx("text-sm mt-2", isDark ? "text-slate-400" : "text-slate-600")}>
                Get AI-powered feedback to improve your resume and stand out
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className={clsx("text-xs font-medium", isDark ? "text-violet-400" : "text-violet-600")}>
                  Powered by AI
                </span>
              </div>
            </div>
          </Link>

          {/* More tools can be added here */}
        </div>
      </div>

      {/* Opportunities Section */}
      <div>
        <h2 className={clsx("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
          Open Positions
        </h2>

        {loading ? (
          <p className={clsx("text-center py-8", isDark ? "text-slate-400" : "text-slate-500")}>
            Loading opportunities...
          </p>
        ) : opportunities.length === 0 ? (
          <div className={clsx(
            "text-center py-12 rounded-xl border border-dashed",
            isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-300"
          )}>
            <Briefcase className={clsx("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
            <p className={clsx(isDark ? "text-slate-400" : "text-slate-500")}>
              No open positions at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {opportunities.map((job) => (
              <Card key={job._id} className={clsx(
                "hover:shadow-lg transition-all",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {job.role}
                      </h3>
                      <div className={clsx("flex items-center mt-1", isDark ? "text-slate-400" : "text-slate-600")}>
                        <Building className="w-4 h-4 mr-1" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {job.type || 'Full Time'}
                    </span>
                  </div>

                  <div className={clsx("mt-4 flex items-center text-sm space-x-4", isDark ? "text-slate-400" : "text-slate-500")}>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location || 'Remote'}
                    </div>
                    <div>₹ {job.salary || 'Not disclosed'}</div>
                  </div>

                  <div className="mt-6">
                    <Button
                      className="w-full"
                      onClick={() => handleApply(job._id)}
                      disabled={job.applied}
                    >
                      {job.applied ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Placement;
