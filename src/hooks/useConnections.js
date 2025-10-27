import { useState, useEffect, useCallback } from 'react';
import { connections } from '../api/linkedinApi';

export function useConnections(type = 'all') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (type) {
        case 'pending':
          response = await connections.getPending();
          break;
        case 'accepted':
          response = await connections.getAccepted();
          break;
        default:
          response = await connections.getHistory();
      }
      
      setData(response.data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch connections:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

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
