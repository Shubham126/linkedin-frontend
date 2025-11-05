// ==================== FILE: frontend/src/components/layout/Navbar.jsx ====================
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
    <nav className="sticky top-0 z-40 w-full bg-white border-b h-16 flex items-center" style={{ borderColor: '#E6E6FA' }}>
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: '#00008B' }}>
              🔗
            </div>
            <div>
              <h1 className="font-bold text-lg hidden sm:block" style={{ color: '#00008B' }}>
                LinkedIn Automation
              </h1>
              <h1 className="font-bold text-lg sm:hidden" style={{ color: '#00008B' }}>
                LinkedIn
              </h1>
            </div>
          </div>
        </div>

        {/* Right Section - Credentials & Settings */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* LinkedIn Account Badge */}
          {credentials ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border transition hidden sm:flex" style={{ backgroundColor: '#E6E6FA', borderColor: '#00008B' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00008B' }} />
              <span className="text-sm font-medium hidden md:block" style={{ color: '#00008B' }}>
                {credentials.email}
              </span>
              <span className="text-sm font-medium md:hidden" style={{ color: '#00008B' }}>
                Connected
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/credentials-setup')}
              className="px-3 py-2 rounded-xl text-sm font-medium border transition hidden sm:block"
              style={{ backgroundColor: '#FFE6E6', borderColor: '#FF6B6B', color: '#FF6B6B' }}
            >
              ⚠️ Setup
            </button>
          )}

          {/* Status Indicator (Mobile) */}
          {credentials && (
            <div className="w-2 h-2 rounded-full sm:hidden" style={{ backgroundColor: '#00008B' }} />
          )}

          {/* User Avatar / Settings Button */}
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold transition hover:shadow-md"
            style={{ backgroundColor: '#00008B' }}
            title="Settings"
          >
            {credentials?.email?.[0]?.toUpperCase() || 'U'}
          </button>
        </div>
      </div>
    </nav>
  );
}
