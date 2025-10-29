import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('linkedinCredentials');
    if (saved) {
      setCredentials(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden -ml-2 mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      >
        <span className="text-2xl">☰</span>
      </button>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          {/* LinkedIn Account Badge */}
          {credentials ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-700 hidden sm:block">
                {credentials.email}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/credentials-setup')}
              className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 hover:bg-yellow-100 transition-colors"
            >
              ⚠️ Setup LinkedIn
            </button>
          )}

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium cursor-pointer" onClick={() => navigate('/settings')}>
            {credentials?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
}
