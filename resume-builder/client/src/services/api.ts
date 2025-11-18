import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data)
};

// Resume API
export const resumeAPI = {
  getAll: () => api.get('/resume'),
  getOne: (id: string) => api.get(`/resume/${id}`),
  create: (data: any) => api.post('/resume', data),
  update: (id: string, data: any) => api.put(`/resume/${id}`, data),
  duplicate: (id: string) => api.post(`/resume/${id}/duplicate`),
  delete: (id: string) => api.delete(`/resume/${id}`)
};

// AI API
export const aiAPI = {
  generateSummary: (data: { experience: any[]; role: string }) =>
    api.post('/ai/generate-summary', data),
  improveBullet: (data: { bullet: string }) =>
    api.post('/ai/improve-bullet', data),
  generateBullets: (data: { role: string; company: string; count?: number }) =>
    api.post('/ai/generate-bullets', data),
  rewriteForRole: (data: { content: string; targetRole: string }) =>
    api.post('/ai/rewrite-for-role', data),
  analyzeJD: (data: { jobDescription: string }) =>
    api.post('/ai/analyze-jd', data),
  matchResume: (data: { resume: any; jdAnalysis: any }) =>
    api.post('/ai/match-resume', data),
  generateCoverLetter: (data: { resume: any; jobDescription: string; company: string; tone?: string }) =>
    api.post('/ai/generate-cover-letter', data),
  suggestSkills: (data: { role: string; currentSkills: string[] }) =>
    api.post('/ai/suggest-skills', data),
  analyzeResume: (data: { resume: any }) =>
    api.post('/ai/analyze-resume', data)
};

// Upload API
export const uploadAPI = {
  parseResume: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
