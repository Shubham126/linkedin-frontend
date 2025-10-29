import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('linkedinCredentials');
    if (saved) {
      setCredentials(JSON.parse(saved));
    }
  }, []);

  const handleUpdateCredentials = () => {
    navigate('/credentials-setup');
  };

  const handleClearCredentials = () => {
    if (window.confirm('Are you sure you want to clear your LinkedIn credentials?')) {
      localStorage.removeItem('linkedinCredentials');
      setCredentials(null);
      alert('Credentials cleared! Please set them again to use automations.');
      navigate('/credentials-setup');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your LinkedIn credentials and preferences</p>
      </div>

      {/* LinkedIn Credentials */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">LinkedIn Account</h2>
          <button
            onClick={handleUpdateCredentials}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Credentials
          </button>
        </div>
        
        {credentials ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Email
              </label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900">
                {credentials.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Password
              </label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900 font-mono">
                {'•'.repeat(credentials.password?.length || 8)}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleClearCredentials}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Clear LinkedIn Credentials
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No LinkedIn credentials saved</p>
            <button
              onClick={handleUpdateCredentials}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add LinkedIn Credentials
            </button>
          </div>
        )}
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Backend API Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={import.meta.env.VITE_API_KEY || 'Not configured'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Base URL
            </label>
            <input
              type="text"
              value={import.meta.env.VITE_API_BASE_URL || 'Not configured'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">How Automation Works</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Your credentials are stored locally in your browser</li>
              <li>• Backend uses your credentials to login to LinkedIn</li>
              <li>• Automation runs on your behalf using your account</li>
              <li>• All actions appear as if you did them manually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
