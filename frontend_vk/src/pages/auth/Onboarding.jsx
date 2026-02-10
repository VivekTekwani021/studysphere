import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { School, BookOpen, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const [educationLevel, setEducationLevel] = useState(''); // 'School' or 'College'
  // Could add more fields like 'preferences' if needed
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!educationLevel) {
      toast.error('Please select your education level');
      return;
    }

    setLoading(true);
    try {
      const response = await onboardingApi.complete({ educationLevel });
      if (response.success) {
        toast.success('Setup complete!');
        // Update user context if backend returns updated user, or we manually update local state
        // Assuming backend might return updated user in data
        if (response.data && response.data.user) {
          updateUser(response.data.user);
        } else {
          // Manually update
          updateUser({ educationLevel, isOnboarded: true });
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Onboarding failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center border-none">
          <CardTitle className="text-3xl font-bold text-gray-900">Let's personalize your experience</CardTitle>
          <p className="text-gray-500 mt-2">Tell us a bit about your current education status.</p>
        </CardHeader>
        <CardContent className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Option */}
            <div
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${educationLevel === 'School' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
              onClick={() => setEducationLevel('School')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${educationLevel === 'School' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <School size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">School Student</h3>
                  <p className="text-sm text-gray-500 mt-1">For students in K-12. Track daily attendance and basic subjects.</p>
                </div>
                {educationLevel === 'School' && <CheckCircle className="text-indigo-600 animate-in fade-in zoom-in" size={24} />}
              </div>
            </div>

            {/* College Option */}
            <div
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${educationLevel === 'College' ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300 hover:shadow-md'}`}
              onClick={() => setEducationLevel('College')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${educationLevel === 'College' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <BookOpen size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">College Student</h3>
                  <p className="text-sm text-gray-500 mt-1">For university students. Track subject-wise attendance and advanced topics.</p>
                </div>
                {educationLevel === 'College' && <CheckCircle className="text-purple-600 animate-in fade-in zoom-in" size={24} />}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={handleComplete}
              isLoading={loading}
              className="w-full md:w-auto"
              disabled={!educationLevel}
            >
              Get Started
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
