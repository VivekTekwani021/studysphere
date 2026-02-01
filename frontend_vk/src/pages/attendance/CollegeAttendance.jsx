import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { attendanceApi } from '../../api/attendance.api';
import toast from 'react-hot-toast';

const CollegeAttendance = () => {
  const [subjects, setSubjects] = useState([]); // Assuming API returns subjects with their attendance stats
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // The GET /attendance endpoint for college might return list of subjects
  // Or we need to infer subjects from history. 
  // Wait, API endpoint: `/attendance` Get attendance records. 
  // For College, this likely returns the subject list and their stats (attendance percentage, total classes etc.)
  // If not, we might need a separate endpoint to get subjects.
  // The README says: POST /attendance/subjects/setup, POST /attendance/subjects/add. 
  // It suggests subjects are stored. 
  // I will assume GET /attendance returns { subjects: [...] } or structure containing subjects.
  
  const fetchData = async () => {
    try {
      const response = await attendanceApi.getHistory();
      console.log(response);
      if (response.found) {
        // Assume response.data is the array of subjects or contains it
        // Adjust logic based on actual backend response shape
        
        setSubjects(response.subjects || response.data || []); 
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault(); 
    if (!newSubject.trim()) return;
    try {
      console.log(newSubject, typeof newSubject);
      const response = await attendanceApi.addSubject(newSubject);
      if (response.success) {
        toast.success('Subject added');
        setNewSubject('');
        setIsAdding(false);
        fetchData();
      }
    } catch (error) {
      console.log("error:",error);
      toast.error(error.response?.data?.message || 'Failed to add subject');
    }
  };

  const handleDeleteSubject = async (subjectName) => {
    if(!window.confirm(`Delete ${subjectName}?`)) return;
    try {
      const response = await attendanceApi.deleteSubject(subjectName);
      if (response.success) {
        toast.success('Subject deleted');
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleMark = async (subjectName, status) => {
    try {
      const response = await attendanceApi.markCollegeSubject(subjectName, status);
      if (response.success) {
        toast.success(`Marked ${status} for ${subjectName}`);
        fetchData(); // Refresh stats
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Subjects</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

     {isAdding && (
  <Card className="p-4 bg-gray-50 border-dashed border-2">
    <form onSubmit={handleAddSubject}>
      <Input 
        placeholder="Subject Name (e.g. Data Structures)" 
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        required
      />
      <Button type="submit">Save</Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsAdding(false)}
      >
        Cancel
      </Button>
    </form>
  </Card>
)}
      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border">
            <p className="text-gray-500">No subjects added yet.</p>
            <Button variant="ghost" className="mt-2" onClick={() => setIsAdding(true)}>Add your first subject</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub) => (
                <Card key={sub.subjectName || sub._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row justify-between items-start pb-2">
                        <CardTitle className="text-lg">{sub.subjectName}</CardTitle>
                        <button 
                            onClick={() => handleDeleteSubject(sub.name)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <Trash2 size={18} />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex-1">
                                <div className="text-2xl font-bold text-gray-900">
                                    {sub.percentage || 0}%
                                </div>
                                <div className="text-xs text-gray-500">Attendance</div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                {sub.present || 0} / {sub.total || 0} Classes
                            </div>
                        </div>
                        
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleMark(sub.name, 'Present')}
                                className="flex-1 flex items-center justify-center p-2 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                            >
                                <CheckCircle size={18} className="mr-1" /> Present
                            </button>
                            <button 
                                onClick={() => handleMark(sub.name, 'Absent')}
                                className="flex-1 flex items-center justify-center p-2 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                                <XCircle size={18} className="mr-1" /> Absent
                            </button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CollegeAttendance;
