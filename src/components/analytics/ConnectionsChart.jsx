// ==================== FILE: frontend/src/components/analytics/ConnectionsChart.jsx ====================
import { useEffect, useState } from 'react';
import { logsAPI } from '../../api/linkedinApi';

export default function ConnectionsChart() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConnectionData();
  }, []);

  const loadConnectionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await logsAPI.getStats();
      const data = response.data.data || {};
      
      setStats({
        total: Number(data.total) || 0,
        likes: Number(data.likes) || 0,
        comments: Number(data.comments) || 0,
        uniquePostCount: Number(data.uniquePostCount) || 0,
        jobPosts: Number(data.jobPosts) || 0,
        averageLikeScore: Number(data.averageLikeScore) || 0,
        averageCommentScore: Number(data.averageCommentScore) || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err.response?.data?.error || err.message);
      setStats({
        total: 0,
        likes: 0,
        comments: 0,
        uniquePostCount: 0,
        jobPosts: 0,
        averageLikeScore: 0,
        averageCommentScore: 0
      });
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

  if (error && !stats?.total) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-center py-8">❌ Error loading stats: {error}</p>
        <button
          onClick={loadConnectionData}
          className="w-full mt-4 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
          style={{ backgroundColor: '#00008B' }}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  const data = stats || {};

  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  const toFixed = (value, decimals = 1) => {
    const num = safeNumber(value);
    return num.toFixed(decimals);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-6" style={{ color: '#00008B' }}>🤝 Connection Statistics</h3>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Activities</span>
            <span className="text-2xl font-bold" style={{ color: '#00008B' }}>
              {safeNumber(data.total)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="font-bold" style={{ color: '#00008B' }}>{safeNumber(data.likes)}</div>
            <div className="text-xs text-gray-600">👍 Likes</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="font-bold" style={{ color: '#00008B' }}>{safeNumber(data.comments)}</div>
            <div className="text-xs text-gray-600">💬 Comments</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="font-bold" style={{ color: '#00008B' }}>{safeNumber(data.uniquePostCount)}</div>
            <div className="text-xs text-gray-600">📝 Posts</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="font-bold" style={{ color: '#00008B' }}>{safeNumber(data.jobPosts)}</div>
            <div className="text-xs text-gray-600">💼 Job Posts</div>
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
          <h4 className="font-semibold text-gray-900 mb-3">📊 Average Scores</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Like Score</span>
              <span className="text-sm font-bold" style={{ color: '#00008B' }}>
                {toFixed(data.averageLikeScore, 1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(safeNumber(data.averageLikeScore) / 10) * 100}%`, backgroundColor: '#00008B' }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-700">Comment Score</span>
              <span className="text-sm font-bold" style={{ color: '#00008B' }}>
                {toFixed(data.averageCommentScore, 1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(safeNumber(data.averageCommentScore) / 10) * 100}%`, backgroundColor: '#00008B' }}
              ></div>
            </div>
          </div>
        </div>

        <button
          onClick={loadConnectionData}
          className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium"
          style={{ backgroundColor: '#00008B' }}
        >
          🔄 Refresh Stats
        </button>
      </div>
    </div>
  );
}
