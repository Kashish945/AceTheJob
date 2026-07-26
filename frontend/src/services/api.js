import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const INTERVIEW_API_URL = import.meta.env.VITE_INTERVIEW_API_URL || 'http://localhost:5000/api/interview';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth';

const api = axios.create({
    baseURL: API_URL,
});

const interviewApi = axios.create({
    baseURL: INTERVIEW_API_URL,
});

const authApi = axios.create({
    baseURL: AUTH_API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto-logout: Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Add same interceptors for interviewApi
interviewApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

interviewApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Add same interceptors for authApi
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await authApi.post('/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.username) localStorage.setItem('userName', response.data.username);
        if (response.data.email) localStorage.setItem('userEmail', response.data.email);
        if (response.data.education) localStorage.setItem('userEducation', response.data.education);
        if (response.data._id) localStorage.setItem('userId', response.data._id);
        if (response.data.createdAt) localStorage.setItem('userJoinedDate', response.data.createdAt);
    }
    return response.data;
};

export const register = async (name, email, password, education) => {
    // Backend expects 'username', not 'name'
    const response = await authApi.post('/signup', { username: name, email, password, education });
    // Token is no longer set here, it's set after OTP verification
    return response.data;
};

export const verifyOtp = async (email, otp) => {
    const response = await authApi.post('/verify-otp', { email, otp });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.username) localStorage.setItem('userName', response.data.username);
        if (response.data.email) localStorage.setItem('userEmail', response.data.email);
        if (response.data.education) localStorage.setItem('userEducation', response.data.education);
        if (response.data._id) localStorage.setItem('userId', response.data._id);
        if (response.data.createdAt) localStorage.setItem('userJoinedDate', response.data.createdAt);
    }
    return response.data;
};

export const fetchProfile = async () => {
    const response = await authApi.get('/me');
    return response.data;
};

export const analyzeResume = async (data) => {
    // data: { jobRole, jobDescription, resumeText }
    const response = await api.post('/resume-analyzer/resume/analyze', data);
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get('/resume-analyzer/resume/history');
    return response.data;
};

// Interview API endpoints
export const createInterview = async (jobRole, jobDescription, experience) => {
    const response = await interviewApi.post('/interview/generate-questions', { jobRole, jobDescription, experience });
    return response.data;
};

export const getInterviewDetails = async (interviewId) => {
    const response = await interviewApi.get(`/interview/${interviewId}`);
    return response.data;
};

export const getInterviewHistory = async () => {
    const response = await interviewApi.get('/interview/history');
    return response.data;
};

export const submitInterviewAnswer = async (interviewId, question, userAnswer, jobRole) => {
    const response = await interviewApi.post('/feedback/generate-feedback', { interviewId, question, userAnswer, jobRole });
    return response.data;
};

export const getFeedbackHistory = async () => {
    const response = await interviewApi.get('/feedback/history');
    return response.data;
};

// Cheating API endpoints
export const initProctoring = async () => {
    const response = await interviewApi.get('/cheating/init');
    return response.data;
};

export const startCheatingSession = async (interviewId) => {
    const response = await interviewApi.post('/cheating/start-session', { interviewId });
    return response.data;
};

export const generateCheatingReport = async (interviewId) => {
    const response = await interviewApi.post('/cheating/generate-report', { interviewId });
    return response.data;
};

export const getCheatingReport = async (interviewId) => {
    const response = await interviewApi.get(`/cheating/report/${interviewId}`);
    return response.data;
};

export const getInterviewSummary = async (interviewId) => {
    const response = await interviewApi.get(`/cheating/summary/${interviewId}`);
    return response.data;
};

export const getCheatingStatus = async (interviewId) => {
    const response = await interviewApi.get(`/cheating/status/${interviewId}`);
    return response.data;
};

export const logClientAlert = async (interviewId, alertType, message, confidence) => {
    const response = await interviewApi.post('/cheating/log-client-alert', {
        interviewId,
        alertType,
        message,
        confidence
    });
    return response.data;
};

export const getUserStats = async () => {
    const response = await axios.get('http://localhost:5000/api/user/stats', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export default api;
