// ==================== FILE: frontend/src/hooks/useAutomation.js ====================
import { useState, useCallback, useEffect } from 'react';
import { automation } from '../api/linkedinApi';

export function useAutomation() {
  const [activeJob, setActiveJob] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check job status on mount and periodically
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const startJob = useCallback(async (jobType, config = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch(jobType) {
        case 'feed-engagement':
          result = await automation.startFeedEngagement(config.maxPosts || 15);
          break;
        case 'connection-requests':
          result = await automation.startConnectionRequests(
            config.keyword || 'developer', 
            config.maxRequests || 20
          );
          break;
        case 'monitor-connections':
          result = await automation.startMonitorConnections();
          break;
        case 'welcome-messages':
          result = await automation.startWelcomeMessages();
          break;
        case 'search-engagement':
          result = await automation.startSearchEngagement(
            config.keyword || 'developer', 
            config.maxPosts || 10
          );
          break;
        case 'profile-scraping':
          result = await automation.startProfileScraping(
            config.keyword || 'developer', 
            config.maxProfiles || 50
          );
          break;
        default:
          throw new Error('Unknown job type: ' + jobType);
      }
      
      setActiveJob(jobType);
      setJobStatus(result.data);
      return result.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      console.error('Error starting job:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const result = await automation.getJobStatus();
      const status = result.data?.data || {};
      
      if (status.isRunning) {
        setActiveJob(status.script || 'unknown');
        setJobStatus(status);
      } else {
        if (activeJob) {
          setActiveJob(null);
          setJobStatus(null);
        }
      }
      return status;
    } catch (err) {
      console.error('Error checking status:', err.message);
      // Don't set error for status checks to avoid spam
      return null;
    }
  }, [activeJob]);

  const cancelJob = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await automation.cancelJob();
      setActiveJob(null);
      setJobStatus(null);
      return result.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      console.error('Error cancelling job:', errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activeJob,
    jobStatus,
    loading,
    error,
    startJob,
    checkStatus,
    cancelJob
  };
}
