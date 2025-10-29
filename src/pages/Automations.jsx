import { useState, useEffect } from 'react';
import AutomationCard from '../components/automation/AutomationCard';
import { automation } from '../api/linkedinApi';

export default function Automations() {
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkJobStatus();
    
    // Poll job status every 3 seconds
    const interval = setInterval(checkJobStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkJobStatus = async () => {
    try {
      const response = await automation.getCurrentJobStatus();
      setCurrentJob(response.data.data);
    } catch (error) {
      console.error('Failed to check job status:', error);
    }
  };

  const handleCancelJob = async () => {
    if (!window.confirm('Are you sure you want to cancel the current job?')) return;
    
    setLoading(true);
    try {
      const response = await automation.cancelCurrentJob();
      alert(`✅ ${response.data.message}`);
      await checkJobStatus();
    } catch (error) {
      alert(`❌ Failed to cancel job: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const automations = [
    {
      id: 'feed-engagement',
      name: 'Feed Engagement',
      description: 'Automatically like and comment on your LinkedIn feed posts',
      icon: '👍',
      color: 'blue',
      inputs: [
        { name: 'maxPosts', label: 'Max Posts', type: 'number', default: 15 }
      ],
      action: (data) => automation.startFeedEngagement(data.maxPosts)
    },
    {
      id: 'connection-requests',
      name: 'Connection Requests',
      description: 'Send personalized connection requests based on keywords',
      icon: '🤝',
      color: 'green',
      inputs: [
        { name: 'keyword', label: 'Keyword', type: 'text', default: 'developer' },
        { name: 'maxRequests', label: 'Max Requests', type: 'number', default: 20 }
      ],
      action: (data) => automation.startConnectionRequests(data.keyword, data.maxRequests)
    },
    {
      id: 'monitor-connections',
      name: 'Monitor Connections',
      description: 'Check and track pending connection requests',
      icon: '👀',
      color: 'purple',
      inputs: [],
      action: () => automation.startMonitorConnections()
    },
    {
      id: 'welcome-messages',
      name: 'Welcome Messages',
      description: 'Send welcome messages to new connections',
      icon: '💌',
      color: 'pink',
      inputs: [],
      action: () => automation.startWelcomeMessages()
    },
    {
      id: 'search-engagement',
      name: 'Search Engagement',
      description: 'Search for posts by keyword and engage with them',
      icon: '🔍',
      color: 'orange',
      inputs: [
        { name: 'keyword', label: 'Keyword', type: 'text', default: 'AI' },
        { name: 'maxPosts', label: 'Max Posts', type: 'number', default: 10 }
      ],
      action: (data) => automation.startSearchEngagement(data.keyword, data.maxPosts)
    },
    {
      id: 'profile-scraping',
      name: 'Profile Scraping',
      description: 'Extract profile data and save to Google Sheets',
      icon: '📋',
      color: 'cyan',
      inputs: [
        { name: 'keyword', label: 'Keyword', type: 'text', default: 'developer' },
        { name: 'maxProfiles', label: 'Max Profiles', type: 'number', default: 50 }
      ],
      action: (data) => automation.startProfileScraping(data.keyword, data.maxProfiles)
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Automations</h1>
        <p className="text-gray-500 mt-1">Manage and run your LinkedIn automation tasks</p>
      </div>

      {/* Current Job Status */}
      {currentJob?.isRunning ? (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-lg font-semibold text-green-900">Job Running</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Job ID:</span>
                  <code className="px-2 py-1 bg-white rounded border border-green-200 text-green-800 font-mono text-xs">
                    {currentJob.jobId}
                  </code>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Script:</span>
                  <span className="text-gray-900">{currentJob.scriptName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Running for:</span>
                  <span className="text-gray-900">
                    {Math.round(currentJob.runningFor / 1000)}s
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCancelJob}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>🛑</span>
              {loading ? 'Cancelling...' : 'Cancel Job'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <p className="text-blue-900 font-medium">No job is currently running. Select an automation below to start.</p>
          </div>
        </div>
      )}

      {/* Warning if job is running */}
      {currentJob?.isRunning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-2">
            <span className="text-xl">⚠️</span>
            <div className="text-sm">
              <p className="font-medium text-yellow-900">Only one job can run at a time</p>
              <p className="text-yellow-700">Please wait for the current job to complete or cancel it before starting another.</p>
            </div>
          </div>
        </div>
      )}

      {/* Automation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((auto) => (
          <AutomationCard
            key={auto.id}
            automation={auto}
            disabled={currentJob?.isRunning}
            onRefresh={checkJobStatus}
          />
        ))}
      </div>
    </div>
  );
}
