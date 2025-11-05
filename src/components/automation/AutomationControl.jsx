// ==================== FILE: frontend/src/components/automation/AutomationControl.jsx (Updated) ====================
import { useState, useEffect } from 'react';
import { automation } from '../../api/linkedinApi';
import AutomationCard from './AutomationCard';

export default function AutomationControl() {
  const [activeJob, setActiveJob] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    checkJobStatus();
    const interval = setInterval(checkJobStatus, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const checkJobStatus = async () => {
    try {
      const response = await automation.getJobStatus();
      const status = response.data.data;
      
      if (status.isRunning) {
        setActiveJob(status.script);
        setJobStatus(status);
      } else {
        setActiveJob(null);
        setJobStatus(null);
      }
    } catch (error) {
      console.error('Failed to check job status:', error);
    }
  };

  const handleCancelJob = async () => {
    setCancelling(true);
    try {
      const result = await automation.cancelJob();
      
      if (result.success) {
        console.log('✅ Cancellation initiated');
        // Keep checking status until job is gone
        let checkCount = 0;
        const checkInterval = setInterval(async () => {
          checkCount++;
          const status = await automation.getJobStatus();
          
          if (!status.data.data.isRunning || checkCount > 30) {
            clearInterval(checkInterval);
            setActiveJob(null);
            setJobStatus(null);
            setCancelling(false);
            
            if (!status.data.data.isRunning) {
              alert('✅ Job cancelled successfully!');
            } else {
              alert('⚠️ Job still running, trying force kill...');
              await handleForceKill();
            }
          }
        }, 500); // Check every 500ms
      } else {
        throw new Error(result.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error('Error cancelling job:', error);
      alert('❌ Cancel failed: ' + error.message);
      setCancelling(false);
    }
  };

  const handleForceKill = async () => {
    try {
      const result = await automation.forceKillJob();
      
      if (result.success) {
        setActiveJob(null);
        setJobStatus(null);
        setCancelling(false);
        alert('✅ Job force killed successfully!');
      } else {
        alert('❌ Force kill failed: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
      setCancelling(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    checkJobStatus();
  };

  const automations = [
    {
      name: 'Feed Engagement',
      description: 'Like and comment on posts from your LinkedIn feed',
      icon: '📊',
      color: '#00008B',
      action: (data) => automation.startFeedEngagement(data.maxPosts),
      inputs: [
        { name: 'maxPosts', label: 'Max Posts', type: 'number', default: 15 }
      ]
    },
    {
      name: 'Connection Requests',
      description: 'Send connection requests to people based on keywords',
      icon: '🤝',
      color: '#00008B',
      action: (data) => automation.startConnectionRequests(data.keyword, data.maxRequests),
      inputs: [
        { name: 'keyword', label: 'Search Keyword', type: 'text', default: 'developer' },
        { name: 'maxRequests', label: 'Max Requests', type: 'number', default: 20 }
      ]
    },
    {
      name: 'Search Engagement',
      description: 'Search for specific posts and engage with them',
      icon: '🔍',
      color: '#00008B',
      action: (data) => automation.startSearchEngagement(data.keyword, data.maxPosts),
      inputs: [
        { name: 'keyword', label: 'Search Keyword', type: 'text', default: 'developer' },
        { name: 'maxPosts', label: 'Max Posts', type: 'number', default: 10 }
      ]
    },
    {
      name: 'Profile Scraping',
      description: 'Extract profile data from LinkedIn search results',
      icon: '📋',
      color: '#00008B',
      action: (data) => automation.startProfileScraping(data.keyword, data.maxProfiles),
      inputs: [
        { name: 'keyword', label: 'Search Keyword', type: 'text', default: 'developer' },
        { name: 'maxProfiles', label: 'Max Profiles', type: 'number', default: 50 }
      ]
    },
    {
      name: 'Monitor Connections',
      description: 'Check which connection requests were accepted',
      icon: '👀',
      color: '#00008B',
      action: () => automation.startMonitorConnections(),
      inputs: []
    },
    {
      name: 'Welcome Messages',
      description: 'Send welcome messages to newly accepted connections',
      icon: '💬',
      color: '#00008B',
      action: () => automation.startWelcomeMessages(),
      inputs: []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Active Job Banner */}
      {activeJob && (
        <div className="rounded-2xl p-6 text-white shadow-lg" style={{ backgroundColor: '#00008B' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
              <div>
                <p className="text-lg font-semibold">
                  {jobStatus?.status === 'killing' ? '⏳ Cancelling...' : '⏳ Automation Running'}
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  Script: {jobStatus?.script || activeJob}
                </p>
                {jobStatus?.pid && (
                  <p className="text-blue-100 text-xs mt-1">
                    PID: {jobStatus.pid} | Uptime: {jobStatus.uptime}s | Status: {jobStatus.status}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelJob}
                disabled={cancelling}
                className="px-6 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? '⏳ Cancelling...' : '⏹️ Cancel'}
              </button>
              <button
                onClick={handleForceKill}
                disabled={cancelling}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Force kill if cancel is stuck"
              >
                💥 Force Kill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#FFF8DC', borderColor: '#FFD700' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-gray-900">Important Notes:</p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>• Only one automation can run at a time</li>
              <li>• Click "Cancel" for graceful shutdown (waits up to 3 seconds)</li>
              <li>• Click "Force Kill" if cancel is stuck or taking too long</li>
              <li>• All activity automatically saved to CSV files</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Automation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((auto, idx) => (
          <AutomationCard
            key={idx}
            automation={auto}
            disabled={!!activeJob}
            onRefresh={handleRefresh}
          />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: '#00008B' }}>📊 Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="text-2xl font-bold" style={{ color: '#00008B' }}>6</div>
            <div className="text-sm text-gray-600">Automations</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="text-2xl font-bold" style={{ color: '#00008B' }}>{activeJob ? '1' : '0'}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="text-2xl font-bold" style={{ color: '#00008B' }}>✓</div>
            <div className="text-sm text-gray-600">MongoDB</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="text-2xl font-bold" style={{ color: '#00008B' }}>✓</div>
            <div className="text-sm text-gray-600">CSV</div>
          </div>
        </div>
      </div>
    </div>
  );
}
