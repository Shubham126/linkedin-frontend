import { useState, useCallback } from 'react';
import { automation } from '../api/linkedinApi';

export function useAutomation() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startAutomation = useCallback(async (automationType, params) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (automationType) {
        case 'feed-engagement':
          response = await automation.startFeedEngagement(params.maxPosts);
          break;
        case 'connection-requests':
          response = await automation.startConnectionRequests(params.keyword, params.maxRequests);
          break;
        case 'monitor-connections':
          response = await automation.startMonitorConnections();
          break;
        case 'welcome-messages':
          response = await automation.startWelcomeMessages();
          break;
        case 'search-engagement':
          response = await automation.startSearchEngagement(params.keyword, params.maxPosts);
          break;
        case 'profile-scraping':
          response = await automation.startProfileScraping(params.keyword, params.maxProfiles);
          break;
        default:
          throw new Error('Unknown automation type');
      }
      
      const jobId = response.data.jobId;
      setActiveJobs(prev => [...prev, { id: jobId, type: automationType, status: 'running' }]);
      
      return { success: true, jobId };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkJobStatus = useCallback(async (jobId) => {
    try {
      const response = await automation.getJobStatus(jobId);
      return response.data;
    } catch (err) {
      console.error('Failed to check job status:', err);
      return null;
    }
  }, []);

  const stopJob = useCallback(async (jobId) => {
    try {
      await automation.stopJob(jobId);
      setActiveJobs(prev => prev.filter(job => job.id !== jobId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return {
    activeJobs,
    loading,
    error,
    startAutomation,
    checkJobStatus,
    stopJob
  };
}
