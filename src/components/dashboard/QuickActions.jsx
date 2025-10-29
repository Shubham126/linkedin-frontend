import { useState, useEffect } from 'react';
import { automation } from '../../api/linkedinApi';

export default function QuickActions({ onRefresh }) {
  const [loading, setLoading] = useState({});
  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    checkJobStatus();
  }, []);

  const checkJobStatus = async () => {
    try {
      const response = await automation.getCurrentJobStatus();
      setCurrentJob(response.data.data);
    } catch (error) {
      console.error('Failed to check job status:', error);
    }
  };

  const actions = [
    {
      id: 'feed',
      name: 'Feed Engagement',
      icon: '👍',
      description: 'Like & comment on posts',
      action: () => automation.startFeedEngagement(15)
    },
    {
      id: 'connections',
      name: 'Send Requests',
      icon: '🤝',
      description: 'Send connection requests',
      action: () => automation.startConnectionRequests('developer', 20)
    },
    {
      id: 'monitor',
      name: 'Monitor',
      icon: '👀',
      description: 'Check pending connections',
      action: () => automation.startMonitorConnections()
    },
    {
      id: 'welcome',
      name: 'Welcome Messages',
      icon: '💌',
      description: 'Send welcome messages',
      action: () => automation.startWelcomeMessages()
    }
  ];

  const handleAction = async (actionId, actionFn) => {
    if (currentJob?.isRunning) {
      alert('⚠️ A job is already running. Please wait or cancel it first.');
      return;
    }

    setLoading(prev => ({ ...prev, [actionId]: true }));
    try {
      const response = await actionFn();
      alert(`✅ ${response.data.message}`);
      await checkJobStatus();
      if (onRefresh) onRefresh();
    } catch (error) {
      alert(`❌ Failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const isDisabled = currentJob?.isRunning;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>
      
      <div className="p-4 space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id, action.action)}
            disabled={loading[action.id] || isDisabled}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${
              isDisabled 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl">{action.icon}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
            {loading[action.id] && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
