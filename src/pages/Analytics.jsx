import { useEffect, useState } from 'react';
import { analytics } from '../api/linkedinApi';
import EngagementChart from '../components/analytics/EngagementChart';
import ConnectionChart from '../components/analytics/ConnectionsChart';
import StatsCard from '../components/dashboard/StatsCard';

export default function Analytics() {
  const [stats, setStats] = useState({
    activity: null,
    connections: null,
    engagement: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const [activityRes, connectionRes, engagementRes] = await Promise.all([
        analytics.getActivityStats(),
        analytics.getConnectionStats(),
        analytics.getEngagementStats()
      ]);

      setStats({
        activity: activityRes.data.data,
        connections: connectionRes.data.data,
        engagement: engagementRes.data.data
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Analytics</h1>
        <p className="text-gray-500 mt-1">Deep dive into your LinkedIn automation performance</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Activities"
          value={safeNumber(stats.activity?.total)}
          icon="🎯"
        />
        <StatsCard
          title="Engagement Rate"
          value={`${safeNumber(stats.engagement?.engagementRate, '0')}%`}
          icon="❤️"
        />
        <StatsCard
          title="Avg Likes/Post"
          value={safeNumber(stats.engagement?.avgLikesPerPost, 0).toFixed(1)}
          icon="👍"
        />
        <StatsCard
          title="Avg Comments/Post"
          value={safeNumber(stats.engagement?.avgCommentsPerPost, 0).toFixed(1)}
          icon="💬"
        />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <EngagementChart />
        <ConnectionChart />
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Likes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {safeNumber(stats.activity?.likes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {stats.activity?.total > 0 
                    ? `${((stats.activity.likes / stats.activity.total) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Comments
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {safeNumber(stats.activity?.comments)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {stats.activity?.total > 0 
                    ? `${((stats.activity.comments / stats.activity.total) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Unique Posts Engaged
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {safeNumber(stats.activity?.uniquePosts)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  100%
                </td>
              </tr>
              <tr className="hover:bg-gray-50 bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                  Pending Connections
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-900">
                  {safeNumber(stats.connections?.pending)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-700">
                  {stats.connections?.total > 0 
                    ? `${((stats.connections.pending / stats.connections.total) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </td>
              </tr>
              <tr className="hover:bg-gray-50 bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                  Accepted Connections
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-900">
                  {safeNumber(stats.connections?.accepted)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-700">
                  {stats.connections?.total > 0 
                    ? `${((stats.connections.accepted / stats.connections.total) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
