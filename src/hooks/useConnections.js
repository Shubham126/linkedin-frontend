import { useState, useEffect, useCallback } from 'react';
import { logsAPI } from '../api/linkedinApi';

export function useConnections(filter = 'all') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (filter) {
        case 'pending':
          // Get connection_requested actions that haven't been accepted
          response = await logsAPI.getLogsByAction('connection_requested');
          break;
          
        case 'accepted':
          // Get connection_accepted actions
          response = await logsAPI.getLogsByAction('connection_accepted');
          break;
          
        case 'messaged':
          // Get message_sent actions
          response = await logsAPI.getLogsByAction('message_sent');
          break;
          
        default:
          // Get all logs
          response = await logsAPI.getUserLogs();
      }
      
      setData(response.data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch connections:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections: data,
    loading,
    error,
    refetch: fetchConnections
  };
}
