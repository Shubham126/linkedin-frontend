// ==================== FILE: frontend/src/pages/Connections.jsx ====================
import { useEffect, useState } from 'react';
import { logsAPI } from '../api/linkedinApi';

export default function Connections() {
  const [activeTab, setActiveTab] = useState('all');
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadConnections();
  }, [activeTab]);

  const loadConnections = async () => {
    setLoading(true);
    try {
      let response;
      
      switch(activeTab) {
        case 'requests':
          response = await logsAPI.getConnectionRequests();
          break;
        case 'accepted':
          response = await logsAPI.getConnectionAccepted();
          break;
        default:
          response = await logsAPI.getUserLogs('connection_requested');
      }
      
      setConnections(response.data.data || []);
    } catch (error) {
      console.error('Failed to load connections:', error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = connections.filter(conn => 
    conn.authorName?.toLowerCase().includes(filter.toLowerCase()) ||
    conn.postPreview?.toLowerCase().includes(filter.toLowerCase())
  );

  const tabs = [
    { id: 'all', name: '📋 All Connections', icon: '🤝' },
    { id: 'requests', name: '📤 Sent Requests', icon: '➡️' },
    { id: 'accepted', name: '✅ Accepted', icon: '🎉' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🤝 Connections</h1>
        <p className="text-gray-500 mt-1">Manage and track your LinkedIn connections</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setFilter('');
              }}
              className={`flex-1 px-6 py-4 font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.name}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({connections.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <input
          type="text"
          placeholder="🔍 Search by name or content..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredConnections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-xl text-gray-600">No connections found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredConnections.map((connection, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {connection.authorName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {connection.postPreview || connection.commentText || 'No additional info'}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {connection.action && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {connection.action === 'connection_requested' ? '📤 Sent' : 
                         connection.action === 'connection_accepted' ? '✅ Accepted' : 
                         connection.action}
                      </span>
                    )}
                    
                    {connection.isJobPost && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        💼 Job Post
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500">
                      {new Date(connection.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <p className="text-2xl">🤝</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={loadConnections}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          🔄 Refresh Connections
        </button>
      </div>
    </div>
  );
}
