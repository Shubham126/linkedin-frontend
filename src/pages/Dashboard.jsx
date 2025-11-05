// ==================== FILE: frontend/src/pages/Dashboard.jsx ====================
import { useEffect, useState } from 'react';
import { logsAPI } from '../api/linkedinApi';
import StatsCard from '../components/dashboard/StatsCard';
import EngagementChart from '../components/analytics/EngagementChart';
import ConnectionsChart from '../components/analytics/ConnectionsChart';
import AutomationControl from '../components/automation/AutomationControl';
import { useAutomation } from '../hooks/useAutomation';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { activeJob, jobStatus } = useAutomation();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await logsAPI.getStats();
      const logsRes = await logsAPI.getUserLogs();
      
      setStats(statsRes.data.data);
      setRecentActivity((logsRes.data.data || []).slice(0, 10));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
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

  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: '#00008B' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Manage your LinkedIn automation credentials and tasks</p>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00008B' }}></div>
        <span className="text-sm font-medium" style={{ color: '#00008B' }}>System Active</span>
      </div>

      {activeJob && (
        <div className="p-4 rounded-2xl" style={{ backgroundColor: '#00008B', color: 'white' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <div>
                <p className="font-semibold">⏳ Automation Running</p>
                <p className="text-blue-100 text-sm mt-1">
                  Script: {jobStatus?.script || activeJob}
                </p>
              </div>
            </div>
            <button
              onClick={() => location.reload()}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              ⏹️ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: '#00008B' }}>
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-1 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'text-white border-b-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              borderColor: activeTab === 'overview' ? '#00008B' : 'transparent',
              color: activeTab === 'overview' ? '#00008B' : undefined
            }}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-1 py-3 font-semibold transition ${
              activeTab === 'automation'
                ? 'text-white border-b-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              borderColor: activeTab === 'automation' ? '#00008B' : 'transparent',
              color: activeTab === 'automation' ? '#00008B' : undefined
            }}
          >
            🤖 Automation
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-1 py-3 font-semibold transition ${
              activeTab === 'analytics'
                ? 'text-white border-b-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              borderColor: activeTab === 'analytics' ? '#00008B' : 'transparent',
              color: activeTab === 'analytics' ? '#00008B' : undefined
            }}
          >
            📈 Analytics
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Activities</p>
                  <p className="text-3xl font-bold" style={{ color: '#00008B' }}>
                    {safeNumber(stats?.total)}
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Likes Given</p>
                  <p className="text-3xl font-bold" style={{ color: '#00008B' }}>
                    {safeNumber(stats?.likes)}
                  </p>
                </div>
                <div className="text-4xl">👍</div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Comments Posted</p>
                  <p className="text-3xl font-bold" style={{ color: '#00008B' }}>
                    {safeNumber(stats?.comments)}
                  </p>
                </div>
                <div className="text-4xl">💬</div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Unique Posts</p>
                  <p className="text-3xl font-bold" style={{ color: '#00008B' }}>
                    {safeNumber(stats?.uniquePostCount)}
                  </p>
                </div>
                <div className="text-4xl">📝</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <EngagementChart />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <ConnectionsChart />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-6" style={{ color: '#00008B' }}>
              📋 Recent Activity
            </h2>
            
            {recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start justify-between p-4 rounded-xl transition hover:bg-gray-50"
                    style={{ backgroundColor: '#f0f0f0' }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {activity.action === 'like' ? '👍' : activity.action === 'comment' ? '💬' : activity.action === 'connection_requested' ? '🤝' : '👁️'}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{activity.authorName}</p>
                          <p className="text-sm text-gray-600">
                            {activity.action === 'like' && `Liked post (Score: ${activity.likeScore || '-'}/10)`}
                            {activity.action === 'comment' && `Commented (Score: ${activity.commentScore || '-'}/10)`}
                            {activity.action === 'connection_requested' && 'Connection request sent'}
                            {activity.action === 'message_sent' && 'Message sent'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                      {activity.isJobPost && (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E6E6FA', color: '#00008B' }}>
                          Job Post
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AutomationControl />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <EngagementChart />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <ConnectionsChart />
          </div>
        </div>
      )}
    </div>
  );
}
