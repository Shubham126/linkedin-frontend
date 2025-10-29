import { useState, useEffect } from 'react';
import { dataAPI } from '../api/linkedinApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

export default function DataDashboard() {
  const [sheetUrls, setSheetUrls] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sheets');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [urlsRes, profilesRes, connectionsRes, messagesRes, statsRes] = await Promise.all([
        dataAPI.getSheetUrls(),
        dataAPI.getScrapedProfiles({ limit: 20 }),
        dataAPI.getConnections({ limit: 20 }),
        dataAPI.getMessages({ limit: 20 }),
        dataAPI.getDataStats()
      ]);

      setSheetUrls(urlsRes.data.data);
      setProfiles(profilesRes.data.data || []);
      setConnections(connectionsRes.data.data || []);
      setMessages(messagesRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'sheets', name: 'Google Sheets', icon: '📑', count: sheetUrls ? Object.keys(sheetUrls).length : 0 },
    { id: 'profiles', name: 'Profiles', icon: '👥', count: profiles.length },
    { id: 'connections', name: 'Connections', icon: '🤝', count: connections.length },
    { id: 'messages', name: 'Messages', icon: '💬', count: messages.length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Dashboard</h1>
          <p className="text-gray-500 mt-1">View your LinkedIn automation data</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profiles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProfiles || 0}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConnections || 0}</p>
              </div>
              <span className="text-4xl">🤝</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages || 0}</p>
              </div>
              <span className="text-4xl">💬</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Google Sheets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSheets || 0}</p>
              </div>
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.name}
              {tab.count > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Google Sheets Tab */}
        {activeTab === 'sheets' && sheetUrls && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(sheetUrls).map(([key, sheet]) => (
                <a
                  key={key}
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {sheet.name}
                    </h3>
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{sheet.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      Open Sheet →
                    </span>
                    <span className="text-xs text-gray-400">ID: {sheet.id.substring(0, 8)}...</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">About Dual Storage</p>
                  <p className="text-blue-700">All data is stored in both MongoDB (for fast queries) and Google Sheets (for easy viewing and sharing)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="overflow-x-auto">
            {profiles.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No profiles found"
                description="Scraped profiles will appear here"
              />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Headline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connection</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{profile.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{profile.headline}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {profile.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info" size="sm">{profile.connectionDegree}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(profile.scrapedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={profile.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Profile →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="overflow-x-auto">
            {connections.length === 0 ? (
              <EmptyState
                icon="🤝"
                title="No connections found"
                description="Connection requests will appear here"
              />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Headline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {connections.map((conn) => (
                    <tr key={conn._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{conn.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{conn.headline}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={conn.status === 'Accepted' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {conn.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(conn.requestSentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {conn.messageSent ? '✅' : '❌'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={conn.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Profile →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="overflow-x-auto">
            {messages.length === 0 ? (
              <EmptyState
                icon="💬"
                title="No messages found"
                description="Sent messages will appear here"
              />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{msg.recipientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info" size="sm">{msg.messageType}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {msg.messageContent}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(msg.sentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={msg.status === 'Sent' ? 'success' : 'default'}
                          size="sm"
                        >
                          {msg.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {msg.replyReceived ? '✅' : '❌'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
