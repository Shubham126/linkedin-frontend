// ==================== FILE: frontend/src/components/analytics/EngagementChart.jsx ====================
import { useEffect, useState } from 'react';
import { logsAPI } from '../../api/linkedinApi';

export default function EngagementChart() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({ likes: 0, comments: 0, connections: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrendData();
  }, []);

  const loadTrendData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await logsAPI.getEngagementTrends(30);
      const trendData = response.data.data || [];
      
      setData(trendData);
      
      const likes = trendData.filter(s => s.action === 'like').length;
      const comments = trendData.filter(s => s.action === 'comment').length;
      const connections = trendData.filter(s => s.action === 'connection_requested').length;
      
      setStats({ likes, comments, connections });
    } catch (err) {
      console.error('Error loading trends:', err);
      setError(err.response?.data?.error || err.message);
      setStats({ likes: 0, comments: 0, connections: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00008B' }} />
      </div>
    );
  }

  if (error && !stats.likes && !stats.comments && !stats.connections) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-center py-8">❌ Error loading chart: {error}</p>
        <button
          onClick={loadTrendData}
          className="w-full mt-4 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
          style={{ backgroundColor: '#00008B' }}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  const likes = safeNumber(stats.likes);
  const comments = safeNumber(stats.comments);
  const connections = safeNumber(stats.connections);
  const total = likes + comments + connections || 1;
  
  const likePercent = (likes / total) * 100;
  const commentPercent = (comments / total) * 100;
  const connectionPercent = (connections / total) * 100;

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-6" style={{ color: '#00008B' }}>📊 Engagement Trends</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
          <div className="text-2xl font-bold" style={{ color: '#00008B' }}>{likes}</div>
          <div className="text-xs text-gray-600 mt-1">👍 Likes</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
          <div className="text-2xl font-bold" style={{ color: '#00008B' }}>{comments}</div>
          <div className="text-xs text-gray-600 mt-1">💬 Comments</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
          <div className="text-2xl font-bold" style={{ color: '#00008B' }}>{connections}</div>
          <div className="text-xs text-gray-600 mt-1">🤝 Requests</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">👍 Likes</span>
            <span className="text-sm font-bold" style={{ color: '#00008B' }}>{likePercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 rounded-full transition-all duration-500" 
              style={{ width: `${likePercent}%`, backgroundColor: '#00008B' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">💬 Comments</span>
            <span className="text-sm font-bold" style={{ color: '#00008B' }}>{commentPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 rounded-full transition-all duration-500" 
              style={{ width: `${commentPercent}%`, backgroundColor: '#00008B' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">🤝 Connections</span>
            <span className="text-sm font-bold" style={{ color: '#00008B' }}>{connectionPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 rounded-full transition-all duration-500" 
              style={{ width: `${connectionPercent}%`, backgroundColor: '#00008B' }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={loadTrendData}
        className="w-full mt-6 px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium"
        style={{ backgroundColor: '#00008B' }}
      >
        🔄 Refresh Data
      </button>
    </div>
  );
}
