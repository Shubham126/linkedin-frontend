import { useState, useEffect, useCallback } from 'react';
import { analytics } from '../api/linkedinApi';

export function useAnalytics(autoRefresh = false, interval = 30000) {
  const [data, setData] = useState({
    activity: null,
    connections: null,
    engagement: null,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [activityRes, connectionRes, engagementRes, recentRes] = await Promise.all([
        analytics.getActivityStats(),
        analytics.getConnectionStats(),
        analytics.getEngagementStats(),
        analytics.getRecentActivity(10)
      ]);

      setData({
        activity: activityRes.data.data,
        connections: connectionRes.data.data,
        engagement: engagementRes.data.data,
        recentActivity: recentRes.data.data
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    if (autoRefresh) {
      const timer = setInterval(fetchAnalytics, interval);
      return () => clearInterval(timer);
    }
  }, [fetchAnalytics, autoRefresh, interval]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics
  };
}
