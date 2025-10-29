import { useState, useEffect } from 'react';
import { automation } from '../../api/linkedinApi';

export default function JobControlPanel() {
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
    
    // Auto-check status every 3 seconds
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await automation.getCurrentJobStatus();
      setJobStatus(response.data.data);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleStart = async (type, params) => {
    if (jobStatus?.isRunning) {
      alert('⚠️ A job is already running. Please cancel it first.');
      return;
    }

    setLoading(true);
    try {
      let response;
      
      switch (type) {
        case 'feed':
          response = await automation.startFeedEngagement(params.maxPosts);
          break;
        case 'connections':
          response = await automation.startConnectionRequests(params.keyword, params.maxRequests);
          break;
        case 'monitor':
          response = await automation.startMonitorConnections();
          break;
        case 'welcome':
          response = await automation.startWelcomeMessages();
          break;
        case 'search':
          response = await automation.startSearchEngagement(params.keyword, params.maxPosts);
          break;
        case 'scrape':
          response = await automation.startProfileScraping(params.keyword, params.maxProfiles);
          break;
      }
      
      alert(`✅ ${response.data.message}\nJob ID: ${response.data.jobId}`);
      checkStatus();
    } catch (error) {
      alert(`❌ ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('⚠️ Are you sure you want to stop the current job?')) return;
    
    setLoading(true);
    try {
      const response = await automation.cancelCurrentJob();
      alert(`✅ ${response.data.message}`);
      checkStatus();
    } catch (error) {
      alert(`❌ ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'feed',
      name: 'Feed Engagement',
      icon: '👍',
      description: 'Like & comment (15 posts)',
      params: { maxPosts: 15 }
    },
    {
      id: 'connections',
      name: 'Send Requests',
      icon: '🤝',
      description: 'Connect (20 people)',
      params: { keyword: 'developer', maxRequests: 20 }
    },
    {
      id: 'monitor',
      name: 'Monitor',
      icon: '👀',
      description: 'Check acceptances',
      params: {}
    },
    {
      id: 'welcome',
      name: 'Welcome Messages',
      icon: '💬',
      description: 'Message new connections',
      params: {}
    },
    {
      id: 'search',
      name: 'Search & Engage',
      icon: '🔍',
      description: 'Search posts (10)',
      params: { keyword: 'AI', maxPosts: 10 }
    },
    {
      id: 'scrape',
      name: 'Scrape Profiles',
      icon: '📋',
      description: 'Collect data (50 profiles)',
      params: { keyword: 'developer', maxProfiles: 50 }
    }
  ];

  const isDisabled = loading || jobStatus?.isRunning;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🎮 Automation Control Panel</h2>
        <p className="text-gray-500 mt-1">Quick start common automation tasks</p>
      </div>

      {/* Current Job Status */}
      <div className={`rounded-xl border-2 p-6 ${
        jobStatus?.isRunning 
          ? 'bg-linear-to-r from-green-50 to-emerald-50 border-green-300' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        {jobStatus?.isRunning ? (
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">🟢 Job Running</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Job ID:</span>{' '}
                    <code className="px-2 py-0.5 bg-white rounded border border-green-200 text-green-800 font-mono text-xs">
                      {jobStatus.jobId}
                    </code>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Script:</span> {jobStatus.scriptName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Running for:</span> {Math.round(jobStatus.runningFor / 1000)}s
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Started:</span> {new Date(jobStatus.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span>🛑</span>
              {loading ? 'Stopping...' : 'Stop Job'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚪</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">No Job Running</h3>
              <p className="text-sm text-gray-500">Ready to start a new automation</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleStart(action.id, action.params)}
              disabled={isDisabled}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${isDisabled
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{action.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1">{action.name}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">How It Works</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Only one job can run at a time</li>
              <li>• Jobs run in the background while server stays active</li>
              <li>• Stop any job anytime without restarting server</li>
              <li>• Check terminal/console for live automation logs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live Log Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-xl">📜</span>
          <div className="text-sm">
            <p className="font-medium text-yellow-900 mb-1">Server Logs</p>
            <p className="text-yellow-700">Check your backend terminal/console for real-time automation logs and detailed progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
