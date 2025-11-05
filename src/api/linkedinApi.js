// ==================== FILE: frontend/src/api/linkedinApi.js ====================
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error interceptor with better logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Helper to get credentials from localStorage
const getCredentials = () => {
  const saved = localStorage.getItem('linkedinCredentials');
  if (!saved) return { email: 'default_user' };
  try {
    return JSON.parse(saved);
  } catch {
    return { email: 'default_user' };
  }
};

// ==================== AUTHENTICATION ====================
export const auth = {
  register: (email, password, name) => {
    return api.post('/auth/register', { email, password, name });
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  linkedinLogin: (email, password) => {
    return api.post('/auth/linkedin/login', { email, password });
  }
};

// ==================== AUTOMATION CONTROL ====================
export const automation = {
  // Start Feed Engagement
  startFeedEngagement: (maxPosts = 15) => {
    const credentials = getCredentials();
    return api.post('/automation/feed-engagement/start', {
      linkedinUsername: credentials?.email || 'default_user',
      linkedinPassword: credentials?.password || '',
      maxPosts
    });
  },

  // Start Connection Requests
  startConnectionRequests: (keyword, maxRequests = 20) => {
    const credentials = getCredentials();
    return api.post('/automation/connection-requests/start', {
      linkedinUsername: credentials?.email || 'default_user',
      linkedinPassword: credentials?.password || '',
      keyword,
      maxRequests
    });
  },

  // Start Monitor Connections
  startMonitorConnections: () => {
    const credentials = getCredentials();
    return api.post('/automation/monitor-connections/start', {
      linkedinUsername: credentials?.email || 'default_user',
      linkedinPassword: credentials?.password || ''
    });
  },

  // Start Welcome Messages
  startWelcomeMessages: () => {
    const credentials = getCredentials();
    return api.post('/automation/welcome-messages/start', {
      linkedinUsername: credentials?.email || 'default_user',
      linkedinPassword: credentials?.password || ''
    });
  },

  // Start Search Engagement
  startSearchEngagement: (keyword, maxPosts = 10) => {
    const credentials = getCredentials();
    return api.post('/automation/search-engagement/start', {
      linkedinUsername: credentials?.email || 'default_user',
      linkedinPassword: credentials?.password || '',
      keyword,
      maxPosts
    });
  },

  // Start Profile Scraping
  startProfileScraping: (keyword, maxProfiles = 50) => {
    const credentials = getCredentials();
    return api.post('/automation/profile-scraping/start', {
      linkedinUsername: credentials?.email || 'default_user',
      linkedinPassword: credentials?.password || '',
      keyword,
      maxProfiles
    });
  },

  // Get Job Status
  cancelJob: () => {
      return api.post('/automation/job/cancel');
    },

    // Force Kill Job
    forceKillJob: () => {
      return api.post('/automation/job/force-kill');
    },

    // Get Job Output
    getJobOutput: () => {
      return api.get('/automation/job/output');
    },

  // Generate AI Post
  generateAIPost: (topic, options = {}) => {
    return api.post('/automation/create-post/generate-ai', {
      topic,
      tone: options.tone || 'professional',
      length: options.length || 'medium',
      includeQuestion: options.includeQuestion !== false,
      style: options.style || 'thought-leadership'
    });
  },

  // Generate Hashtags
  generateHashtags: (postText, count = 5) => {
    return api.post('/automation/create-post/generate-hashtags', {
      postText,
      count
    });
  }
};

// ==================== LOGS API ====================
export const logsAPI = {
  getUserLogs: (action = null) => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    
    const url = action 
      ? `/logs/user/${username}/action/${action}`
      : `/logs/user/${username}`;
    return api.get(url);
  },

  getLogsByAction: (action) => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/user/${username}/action/${action}`);
  },

  getStats: () => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/stats/${username}`);
  },

  getDashboard: () => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/dashboard/${username}`);
  },

  downloadCSV: () => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/download/${username}`, {
      responseType: 'blob'
    });
  },

  getActivityByDate: () => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/activity-by-date/${username}`);
  },

  getTopAuthors: (limit = 10) => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/top-authors/${username}?limit=${limit}`);
  },

  getEngagementTrends: (days = 30) => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.get(`/logs/trends/${username}?days=${days}`);
  },

  getLikes: () => logsAPI.getLogsByAction('like'),
  getComments: () => logsAPI.getLogsByAction('comment'),
  getConnectionRequests: () => logsAPI.getLogsByAction('connection_requested'),
  getConnectionAccepted: () => logsAPI.getLogsByAction('connection_accepted'),
  getMessages: () => logsAPI.getLogsByAction('message_sent'),
  
  deleteOldLogs: (days = 30) => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.post(`/logs/delete-old/${username}`, { days });
  },

  clearAllLogs: () => {
    const credentials = getCredentials();
    const username = credentials?.email || 'default_user';
    return api.delete(`/logs/user/${username}`);
  }
};

export default api;
