import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY
  }
});

// Helper to get credentials from localStorage
const getCredentials = () => {
  const saved = localStorage.getItem('linkedinCredentials');
  if (!saved) return null;
  return JSON.parse(saved);
};

// Automation endpoints - credentials sent in body
export const automation = {
  startFeedEngagement: (maxPosts = 15) => {
    const credentials = getCredentials();
    return api.post('/automation/feed-engagement/start', {
      linkedinUsername: credentials?.email,
      linkedinPassword: credentials?.password,
      maxPosts
    });
  },

  startConnectionRequests: (keyword, maxRequests = 20) => {
    const credentials = getCredentials();
    return api.post('/automation/connection-requests/start', {
      linkedinUsername: credentials?.email,
      linkedinPassword: credentials?.password,
      keyword,
      maxRequests
    });
  },

  startMonitorConnections: () => {
    const credentials = getCredentials();
    return api.post('/automation/monitor-connections/start', {
      linkedinUsername: credentials?.email,
      linkedinPassword: credentials?.password
    });
  },

  startWelcomeMessages: () => {
    const credentials = getCredentials();
    return api.post('/automation/welcome-messages/start', {
      linkedinUsername: credentials?.email,
      linkedinPassword: credentials?.password
    });
  },

  startSearchEngagement: (keyword, maxPosts = 10) => {
    const credentials = getCredentials();
    return api.post('/automation/search-engagement/start', {
      linkedinUsername: credentials?.email,
      linkedinPassword: credentials?.password,
      keyword,
      maxPosts
    });
  },

  startProfileScraping: (keyword, maxProfiles = 50) => {
    const credentials = getCredentials();
    return api.post('/automation/profile-scraping/start', {
      linkedinUsername: credentials?.email,
      linkedinPassword: credentials?.password,
      keyword,
      maxProfiles
    });
  },

  getCurrentJobStatus: () =>
    api.get('/automation/job/status'),

  cancelCurrentJob: () =>
    api.post('/automation/job/cancel')
};

// Analytics endpoints
export const analytics = {
  getActivityStats: () => {
    const credentials = getCredentials();
    return api.post('/analytics/activity-stats', {
      linkedinUsername: credentials?.email
    });
  },

  getConnectionStats: () => {
    const credentials = getCredentials();
    return api.post('/analytics/connection-stats', {
      linkedinUsername: credentials?.email
    });
  },

  getEngagementStats: () => {
    const credentials = getCredentials();
    return api.post('/analytics/engagement-stats', {
      linkedinUsername: credentials?.email
    });
  },

  getRecentActivity: (limit = 10) => {
    const credentials = getCredentials();
    return api.post('/analytics/recent-activity', {
      linkedinUsername: credentials?.email,
      limit
    });
  }
};

// Connection endpoints
export const connections = {
  getPending: () => {
    const credentials = getCredentials();
    return api.post('/connections/pending', {
      linkedinUsername: credentials?.email
    });
  },

  getAccepted: () => {
    const credentials = getCredentials();
    return api.post('/connections/accepted', {
      linkedinUsername: credentials?.email
    });
  },

  getHistory: () => {
    const credentials = getCredentials();
    return api.post('/connections/history', {
      linkedinUsername: credentials?.email
    });
  }
};

// Data endpoints
export const dataAPI = {
  getSheetUrls: () => {
    const credentials = getCredentials();
    return api.post('/data/sheet-urls', {
      linkedinUsername: credentials?.email
    });
  },

  getScrapedProfiles: (params = {}) => {
    const credentials = getCredentials();
    return api.post('/data/profiles', {
      linkedinUsername: credentials?.email,
      ...params
    });
  },

  getConnections: (params = {}) => {
    const credentials = getCredentials();
    return api.post('/data/connections', {
      linkedinUsername: credentials?.email,
      ...params
    });
  },

  getMessages: (params = {}) => {
    const credentials = getCredentials();
    return api.post('/data/messages', {
      linkedinUsername: credentials?.email,
      ...params
    });
  },

  getDataStats: () => {
    const credentials = getCredentials();
    return api.post('/data/stats', {
      linkedinUsername: credentials?.email
    });
  }
};

export default api;
