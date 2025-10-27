import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY
  }
});

// Automation endpoints
export const automation = {
  startFeedEngagement: (maxPosts) =>
    api.post('/automation/feed-engagement/start', { maxPosts }),
  
  startConnectionRequests: (keyword, maxRequests) =>
    api.post('/automation/connection-requests/start', { keyword, maxRequests }),
  
  startMonitorConnections: () =>
    api.post('/automation/monitor-connections/start'),
  
  startWelcomeMessages: () =>
    api.post('/automation/welcome-messages/start'),
  
  startSearchEngagement: (keyword, maxPosts) =>
    api.post('/automation/search-engagement/start', { keyword, maxPosts }),
  
  startProfileScraping: (keyword, maxProfiles) =>
    api.post('/automation/profile-scraping/start', { keyword, maxProfiles }),
  
  getJobStatus: (jobId) =>
    api.get(`/automation/job/${jobId}/status`),
  
  stopJob: (jobId) =>
    api.post(`/automation/job/${jobId}/stop`)
};

// Analytics endpoints
export const analytics = {
  getActivityStats: () =>
    api.get('/analytics/activity-stats'),
  
  getConnectionStats: () =>
    api.get('/analytics/connection-stats'),
  
  getEngagementStats: () =>
    api.get('/analytics/engagement-stats'),
  
  getRecentActivity: (limit = 10) =>
    api.get(`/analytics/recent-activity?limit=${limit}`)
};

// Connection endpoints
export const connections = {
  getPending: () =>
    api.get('/connections/pending'),
  
  getAccepted: () =>
    api.get('/connections/accepted'),
  
  getHistory: () =>
    api.get('/connections/history')
};

export default api;
