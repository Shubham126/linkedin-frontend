import { useState } from 'react';
import AutomationCard from '../components/automation/AutomationCard';
import JobStatusModal from '../components/automation/JobStatusModal';
import { automation } from '../api/linkedinApi';

export default function Automations() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

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

  const handleJobStart = (jobId, automationType) => {
    setActiveJobs([...activeJobs, { id: jobId, type: automationType, status: 'running' }]);
  };

  const handleViewJobStatus = (jobId) => {
    setSelectedJobId(jobId);
    setShowJobModal(true);
  };

  const handleRemoveJob = (jobId) => {
    setActiveJobs(activeJobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Automations</h1>
        <p className="text-gray-500 mt-1">Manage and run your LinkedIn automation tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((auto) => (
          <AutomationCard
            key={auto.id}
            automation={auto}
            onStart={(jobId) => handleJobStart(jobId, auto.id)}
          />
        ))}
      </div>

      {activeJobs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Jobs</h2>
          <div className="space-y-2">
            {activeJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 block">{job.id}</span>
                  <span className="text-xs text-gray-500">{job.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600">Running</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <button
                    onClick={() => handleViewJobStatus(job.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Status
                  </button>
                  <button
                    onClick={() => handleRemoveJob(job.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Status Modal */}
      <JobStatusModal
        jobId={selectedJobId}
        isOpen={showJobModal}
        onClose={() => {
          setShowJobModal(false);
          setSelectedJobId(null);
        }}
      />
    </div>
  );
}
