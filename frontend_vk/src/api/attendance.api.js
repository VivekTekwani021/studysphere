import api from './axiosInstance';

export const attendanceApi = {
    // Get all attendance records
    getHistory: async () => {
        const response = await api.get('/attendance');
        return response.data;
    },

    // Mark attendance for School (daily)
    markSchoolDaily: async (status) => { // status: 'Present' | 'Absent'
        const response = await api.post('/attendance/school', { status });
        console.log(response);
        return response.data;
    },

    // Mark attendance for College (subject-wise)
    markCollegeSubject: async (subjectName, status) => { // status: 'Present' | 'Absent'
        const response = await api.post('/attendance/college', { subjectName, status });
        return response.data;
    },

    // Setup initial subjects (College)
    setupSubjects: async (subjects) => { // subjects: ['Math', 'Physics']
        const response = await api.post('/attendance/subjects/setup', { subjects });
        return response.data;
    },

    // Add a new subject (College)
    addSubject: async (subjectName) => {
        const response = await api.post('/attendance/subjects/add', { subjectName });
        return response.data;
    },

    // Delete a subject (College)
    deleteSubject: async (subjectName) => {
        const response = await api.delete(`/attendance/subjects/${subjectName}`);
        return response.data;
    },

    // Mark subject attendance (alias for markCollegeSubject, used by CollegeAttendance component)
    markSubjectAttendance: async (subjectName, status) => {
        const response = await api.post('/attendance/college', { subjectName, status });
        return response.data;
    }
};
