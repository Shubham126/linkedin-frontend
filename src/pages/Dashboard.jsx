import { useEffect, useState } from 'react';
import { analytics } from '../api/linkedinApi';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const [stats, setStats] = useState({
    activity: null,
    connections: null,
    engagement: null
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [activityRes, connectionRes, engagementRes, recentRes] = await Promise.all([
        analytics.getActivityStats(),
        analytics.getConnectionStats(),
        analytics.getEngagementStats(),
        analytics.getRecentActivity(10)
      ]);

      setStats({
        activity: activityRes.data.data,
        connections: connectionRes.data.data,
        engagement: engagementRes.data.data
      });
      setRecentActivity(recentRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor your LinkedIn automation performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Activities"
          value={stats.activity?.total || 0}
          icon="📊"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Connections"
          value={stats.connections?.total || 0}
          icon="👥"
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          title="Engagement Rate"
          value={`${(stats.engagement?.engagementRate || 0).toFixed(1)}%`}
          icon="❤️"
          trend="+5%"
          trendUp={true}
        />
        <StatsCard
          title="Pending"
          value={stats.connections?.pending || 0}
          icon="⏳"
          trend="-3%"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions onRefresh={loadDashboardData} />
        </div>
      </div>
    </div>
  );
}
