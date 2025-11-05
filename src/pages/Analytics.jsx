// ==================== FILE: frontend/src/pages/Analytics.jsx ====================
import { useEffect, useState } from 'react';
import { logsAPI } from '../api/linkedinApi';
import EngagementChart from '../components/analytics/EngagementChart';
import ConnectionsChart from '../components/analytics/ConnectionsChart';

export default function Analytics() {
  const [topAuthors, setTopAuthors] = useState([]);
  const [activityByDate, setActivityByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [authorsRes, activityRes] = await Promise.all([
        logsAPI.getTopAuthors(10),
        logsAPI.getActivityByDate()
      ]);
      
      setTopAuthors(authorsRes.data.data || []);
      setActivityByDate(activityRes.data.data || []);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📈 Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed engagement and performance analytics</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ❌ Error loading analytics: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>
        <div>
          <ConnectionsChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Authors */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Top Authors</h3>
          
          {topAuthors.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {topAuthors.map((author, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{idx + 1}. {author.authorName || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">Interactions: {author.count || 0}</p>
                  </div>
                  <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}</span>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={loadAnalyticsData}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Activity by Date */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Activity by Date</h3>
          
          {activityByDate.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {activityByDate.slice(0, 10).map((activity, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(activity.date || activity.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.count || 1} activity{(activity.count || 1) !== 1 ? 'ies' : ''}
                      </p>
                    </div>
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={loadAnalyticsData}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
