import { useState } from 'react';
import { automation } from '../api/linkedinApi';

export default function QuickActions({ onRefresh }) {
  const [loading, setLoading] = useState({});

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
    setLoading(prev => ({ ...prev, [actionId]: true }));
    try {
      const response = await actionFn();
      alert(`Started! Job ID: ${response.data.jobId}`);
      onRefresh();
    } catch (error) {
      alert('Failed to start automation: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [actionId]: false }));
    }
  };

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
            disabled={loading[action.id]}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
