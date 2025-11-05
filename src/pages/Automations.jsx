// ==================== FILE: frontend/src/components/automation/AutomationControl.jsx ====================
import { useState } from 'react';
import { automation } from '../api/linkedinApi';

export default function AutomationControl() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [activeJob, setActiveJob] = useState(null);

  const [config, setConfig] = useState({
    feedEngagement: { maxPosts: 15 },
    connectionRequests: { keyword: 'developer', maxRequests: 20 },
    searchEngagement: { keyword: 'developer', maxPosts: 10 },
    profileScraping: { keyword: 'developer', maxProfiles: 50 }
  });

  const startAutomation = async (type) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch(type) {
        case 'feed':
          result = await automation.startFeedEngagement(config.feedEngagement.maxPosts);
          break;
        case 'connections':
          result = await automation.startConnectionRequests(
            config.connectionRequests.keyword,
            config.connectionRequests.maxRequests
          );
          break;
        case 'monitor':
          result = await automation.startMonitorConnections();
          break;
        case 'messages':
          result = await automation.startWelcomeMessages();
          break;
        case 'search':
          result = await automation.startSearchEngagement(
            config.searchEngagement.keyword,
            config.searchEngagement.maxPosts
          );
          break;
        case 'scrape':
          result = await automation.startProfileScraping(
            config.profileScraping.keyword,
            config.profileScraping.maxProfiles
          );
          break;
        default:
          throw new Error('Unknown automation type');
      }
      
      setActiveJob(type);
      setStatus(result.data);
      alert('✅ Automation started successfully!');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      alert('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const cancelAutomation = async () => {
    try {
      const result = await automation.cancelJob();
      setActiveJob(null);
      setStatus(null);
      alert('✅ Job cancelled successfully!');
    } catch (err) {
      alert('❌ Error cancelling job: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 Automation Control</h2>
        
        {activeJob && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-900 font-semibold">⏳ Active Job: {activeJob}</p>
                <p className="text-blue-700 text-sm mt-1">Status: {status?.status || 'running'}</p>
              </div>
              <button
                onClick={cancelAutomation}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                ⏹️ Cancel Job
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feed Engagement */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Feed Engagement</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Posts</label>
                <input
                  type="number"
                  value={config.feedEngagement.maxPosts}
                  onChange={(e) => setConfig({
                    ...config,
                    feedEngagement: { maxPosts: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => startAutomation('feed')}
                disabled={loading || activeJob}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '⏳ Starting...' : '▶️ Start'}
              </button>
            </div>
          </div>

          {/* Connection Requests */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">🤝 Connection Requests</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Keyword</label>
                <input
                  type="text"
                  value={config.connectionRequests.keyword}
                  onChange={(e) => setConfig({
                    ...config,
                    connectionRequests: { ...config.connectionRequests, keyword: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Requests</label>
                <input
                  type="number"
                  value={config.connectionRequests.maxRequests}
                  onChange={(e) => setConfig({
                    ...config,
                    connectionRequests: { ...config.connectionRequests, maxRequests: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => startAutomation('connections')}
                disabled={loading || activeJob}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '⏳ Starting...' : '▶️ Start'}
              </button>
            </div>
          </div>

          {/* Search Engagement */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3">🔍 Search Engagement</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Keyword</label>
                <input
                  type="text"
                  value={config.searchEngagement.keyword}
                  onChange={(e) => setConfig({
                    ...config,
                    searchEngagement: { ...config.searchEngagement, keyword: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Posts</label>
                <input
                  type="number"
                  value={config.searchEngagement.maxPosts}
                  onChange={(e) => setConfig({
                    ...config,
                    searchEngagement: { ...config.searchEngagement, maxPosts: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => startAutomation('search')}
                disabled={loading || activeJob}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? '⏳ Starting...' : '▶️ Start'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-3">⚡ Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => startAutomation('monitor')}
                disabled={loading || activeJob}
                className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
              >
                👀 Monitor Connections
              </button>
              <button
                onClick={() => startAutomation('messages')}
                disabled={loading || activeJob}
                className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
              >
                💬 Send Messages
              </button>
              <button
                onClick={() => startAutomation('scrape')}
                disabled={loading || activeJob}
                className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
              >
                🔗 Scrape Profiles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
