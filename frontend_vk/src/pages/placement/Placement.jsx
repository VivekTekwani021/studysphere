import React, { useState, useEffect } from 'react';
import { applicationApi, activityApi } from '../../api/placement.api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Calendar,
  Plus,
  FileText,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Trash2,
  Edit,
  TrendingUp
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card, { CardContent } from '../../components/common/Card';

const Placement = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user?.educationLevel === 'College') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, activitiesRes] = await Promise.all([
        applicationApi.getMyApplications(),
        activityApi.getAll()
      ]);

      if (appsRes.success) setApplications(appsRes.data);
      if (activitiesRes.success) setActivities(activitiesRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (user?.educationLevel !== 'College') {
    return <Navigate to="/dashboard" replace />;
  }

  const statusColors = {
    'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
    'Test Scheduled': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Test Completed': 'bg-purple-100 text-purple-700 border-purple-200',
    'Interview Scheduled': 'bg-orange-100 text-orange-700 border-orange-200',
    'Interview Completed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Selected': 'bg-green-100 text-green-700 border-green-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200'
  };

  const activityTypeColors = {
    'Drive': 'bg-indigo-500',
    'Training': 'bg-green-500',
    'Mock Interview': 'bg-orange-500',
    'Workshop': 'bg-purple-500',
    'Deadline': 'bg-red-500'
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  return (
    <div className={clsx("min-h-screen p-6", isDark ? "bg-slate-900" : "bg-slate-50")}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
          Career Catalyst
        </h1>
        <p className={clsx("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
          Track your placement journey and stay updated with activities
        </p>
      </div>

      {/* AI Tools Section */}
      <div className="mb-8">
        <h2 className={clsx("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
          AI-Powered Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('applications')}
          className={clsx(
            "px-4 py-2 font-medium transition-colors border-b-2",
            activeTab === 'applications'
              ? "border-indigo-500 text-indigo-500"
              : isDark ? "border-transparent text-slate-400 hover:text-white" : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Application Tracking
          </div>
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={clsx(
            "px-4 py-2 font-medium transition-colors border-b-2",
            activeTab === 'activities'
              ? "border-indigo-500 text-indigo-500"
              : isDark ? "border-transparent text-slate-400 hover:text-white" : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Activities & Timeline
          </div>
        </button>
      </div>

      {/* Application Tracking Tab */}
      {activeTab === 'applications' && (
        <ApplicationsTab
          applications={filteredApplications}
          loading={loading}
          isDark={isDark}
          statusColors={statusColors}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setShowAddModal={setShowAddModal}
          fetchData={fetchData}
        />
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <ActivitiesTab
          activities={activities}
          loading={loading}
          isDark={isDark}
          activityTypeColors={activityTypeColors}
          fetchData={fetchData}
          user={user}
        />
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <AddApplicationModal
          isDark={isDark}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

// Applications Tab Component
const ApplicationsTab = ({ applications, loading, isDark, statusColors, filterStatus, setFilterStatus, setShowAddModal, fetchData }) => {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await applicationApi.delete(id);
      toast.success('Application deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await applicationApi.update(id, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statuses = ['all', 'Applied', 'Test Scheduled', 'Test Completed', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected'];

  return (
    <div>
      {/* Header with Add Button and Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Filter className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={clsx(
              "px-4 py-2 rounded-lg border transition-colors",
              isDark
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-slate-300 text-slate-900"
            )}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Applications' : status}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <p className={clsx("text-center py-8", isDark ? "text-slate-400" : "text-slate-500")}>
          Loading applications...
        </p>
      ) : applications.length === 0 ? (
        <div className={clsx(
          "text-center py-12 rounded-xl border border-dashed",
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-300"
        )}>
          <Briefcase className={clsx("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
          <p className={clsx(isDark ? "text-slate-400" : "text-slate-500")}>
            No applications yet. Start tracking your applications!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {applications.map((app) => (
            <Card key={app._id} className={clsx(
              "hover:shadow-lg transition-all",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {app.company}
                    </h3>
                    <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                      {app.role}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold border", statusColors[app.status])}>
                    {app.status}
                  </span>
                </div>

                {app.package && (
                  <div className={clsx("flex items-center gap-2 text-sm mb-2", isDark ? "text-slate-400" : "text-slate-600")}>
                    <TrendingUp className="w-4 h-4" />
                    {app.package}
                  </div>
                )}

                {app.location && (
                  <div className={clsx("flex items-center gap-2 text-sm mb-4", isDark ? "text-slate-400" : "text-slate-600")}>
                    <MapPin className="w-4 h-4" />
                    {app.location}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    className={clsx(
                      "px-3 py-1 rounded-lg border text-sm",
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-slate-50 border-slate-300 text-slate-900"
                    )}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Test Scheduled">Test Scheduled</option>
                    <option value="Test Completed">Test Completed</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Interview Completed">Interview Completed</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Activities Tab Component
const ActivitiesTab = ({ activities, loading, isDark, activityTypeColors, fetchData, user }) => {
  const handleRegister = async (id) => {
    try {
      await activityApi.register(id);
      toast.success('Registered successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleUnregister = async (id) => {
    try {
      await activityApi.unregister(id);
      toast.success('Unregistered successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to unregister');
    }
  };

  const upcomingActivities = activities.filter(a => new Date(a.date) >= new Date());
  const pastActivities = activities.filter(a => new Date(a.date) < new Date());

  return (
    <div>
      <h2 className={clsx("text-xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
        Upcoming Activities
      </h2>

      {loading ? (
        <p className={clsx("text-center py-8", isDark ? "text-slate-400" : "text-slate-500")}>
          Loading activities...
        </p>
      ) : upcomingActivities.length === 0 ? (
        <div className={clsx(
          "text-center py-12 rounded-xl border border-dashed mb-8",
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-300"
        )}>
          <Calendar className={clsx("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
          <p className={clsx(isDark ? "text-slate-400" : "text-slate-500")}>
            No upcoming activities
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {upcomingActivities.map((activity) => {
            const isRegistered = activity.participants.includes(user._id);

            return (
              <Card key={activity._id} className={clsx(
                "hover:shadow-lg transition-all",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={clsx("p-3 rounded-xl", activityTypeColors[activity.type])}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {activity.title}
                      </h3>
                      <p className={clsx("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-600")}>
                        {activity.description}
                      </p>

                      <div className={clsx("flex items-center gap-4 mt-3 text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {activity.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.participants.length}
                          {activity.maxParticipants && `/${activity.maxParticipants}`}
                        </div>
                      </div>

                      <div className="mt-4">
                        {isRegistered ? (
                          <Button
                            size="sm"
                            onClick={() => handleUnregister(activity._id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Unregister
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRegister(activity._id)}
                            disabled={activity.maxParticipants && activity.participants.length >= activity.maxParticipants}
                          >
                            {activity.maxParticipants && activity.participants.length >= activity.maxParticipants ? 'Full' : 'Register'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Add Application Modal
const AddApplicationModal = ({ isDark, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    package: '',
    location: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applicationApi.create(formData);
      toast.success('Application added successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={clsx(
        "rounded-2xl p-6 max-w-md w-full",
        isDark ? "bg-slate-800" : "bg-white"
      )}>
        <h2 className={clsx("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
          Add New Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={clsx("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={clsx(
                "w-full px-4 py-2 rounded-lg border",
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              )}
            />
          </div>

          <div>
            <label className={clsx("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
              Role *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={clsx(
                "w-full px-4 py-2 rounded-lg border",
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              )}
            />
          </div>

          <div>
            <label className={clsx("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
              Package
            </label>
            <input
              type="text"
              value={formData.package}
              onChange={(e) => setFormData({ ...formData, package: e.target.value })}
              placeholder="e.g., 12 LPA"
              className={clsx(
                "w-full px-4 py-2 rounded-lg border",
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              )}
            />
          </div>

          <div>
            <label className={clsx("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Bangalore"
              className={clsx(
                "w-full px-4 py-2 rounded-lg border",
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              )}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-700">
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="flex-1">
              Add Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Placement;
