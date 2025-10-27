export const AUTOMATION_TYPES = {
  FEED_ENGAGEMENT: 'feed-engagement',
  CONNECTION_REQUESTS: 'connection-requests',
  MONITOR_CONNECTIONS: 'monitor-connections',
  WELCOME_MESSAGES: 'welcome-messages',
  SEARCH_ENGAGEMENT: 'search-engagement',
  PROFILE_SCRAPING: 'profile-scraping'
};

export const ACTIVITY_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  CONNECTION: 'connection',
  MESSAGE: 'message',
  SCRAPE: 'scrape'
};

export const CONNECTION_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
};

export const JOB_STATUS = {
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  STOPPED: 'stopped'
};

export const DEFAULT_LIMITS = {
  MAX_POSTS: 15,
  MAX_REQUESTS: 20,
  MAX_PROFILES: 50,
  RECENT_ACTIVITY: 10
};

export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  ANALYTICS: 60000, // 1 minute
  CONNECTIONS: 120000 // 2 minutes
};

export const COLORS = {
  primary: 'blue',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'cyan',
  purple: 'purple',
  pink: 'pink',
  orange: 'orange'
};
