import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { automation } from '../../api/linkedinApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../common/Badge';

export default function JobStatusModal({ jobId, isOpen, onClose }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobStatus();
      const interval = setInterval(fetchJobStatus, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, jobId]);

  const fetchJobStatus = async () => {
    try {
      const response = await automation.getJobStatus(jobId);
      setStatus(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch job status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!window.confirm('Are you sure you want to stop this job?')) return;
    
    try {
      await automation.stopJob(jobId);
      alert('Job stopped successfully');
      onClose();
    } catch (err) {
      alert('Failed to stop job: ' + err.message);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      running: 'success',
      completed: 'primary',
      failed: 'danger',
      stopped: 'default'
    };
    return variants[status?.toLowerCase()] || 'default';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Status"
      size="lg"
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" text="Loading job status..." />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Job ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job ID
            </label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg font-mono text-sm text-gray-900">
              {jobId}
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Badge 
              variant={getStatusVariant(status?.status)} 
              size="lg"
              icon={status?.status === 'running' ? '⚡' : status?.status === 'completed' ? '✅' : status?.status === 'failed' ? '❌' : '⏸️'}
            >
              {status?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>

          {/* Progress */}
          {status?.progress !== undefined && (
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Progress</span>
                <span>{status.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Details */}
          {status?.details && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details
              </label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg text-sm text-gray-900">
                <pre className="whitespace-pre-wrap">{JSON.stringify(status.details, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            {status?.startedAt && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Started At
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(status.startedAt).toLocaleString()}
                </p>
              </div>
            )}
            {status?.completedAt && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Completed At
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(status.completedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {status?.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">Error:</p>
              <p className="text-sm text-red-600 mt-1">{status.error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {status?.status === 'running' && (
              <button
                onClick={handleStop}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Stop Job
              </button>
            )}
            {status?.status !== 'running' && (
              <button
                onClick={fetchJobStatus}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
