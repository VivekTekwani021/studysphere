import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/resume';
const API_URL = `${import.meta.env.VITE_API_URL}/api/resume`;


export const resumeApi = {
    /**
     * Analyze a resume with optional job description matching
     * @param {File} file - PDF resume file
     * @param {string|null} jobDescription - Optional job description for matching
     */
    analyze: async (file, jobDescription = null) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('resume', file);

        if (jobDescription && jobDescription.trim()) {
            formData.append('jobDescription', jobDescription.trim());
        }

        const response = await axios.post(`${API_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};
