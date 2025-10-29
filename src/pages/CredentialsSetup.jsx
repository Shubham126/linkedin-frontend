import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CredentialsSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if credentials already exist
    const saved = localStorage.getItem('linkedinCredentials');
    if (saved) {
      const creds = JSON.parse(saved);
      setEmail(creds.email);
      setPassword(creds.password);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Save credentials to localStorage
    localStorage.setItem('linkedinCredentials', JSON.stringify({ email, password }));
    
    alert('LinkedIn credentials saved successfully! ✅');
    navigate('/');
  };

  const handleSkip = () => {
    if (localStorage.getItem('linkedinCredentials')) {
      navigate('/');
    } else {
      alert('Please enter your LinkedIn credentials first');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            L
          </div>
          <h1 className="text-3xl font-bold text-gray-900">LinkedIn Automation</h1>
          <p className="text-gray-500 mt-2">Enter your LinkedIn credentials to automate</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <span className="text-xl">ℹ️</span>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">How it works</p>
              <p className="text-blue-700">We'll use your LinkedIn credentials to login and automate tasks on your behalf.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your LinkedIn Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your LinkedIn Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              Save Credentials
            </button>
            {localStorage.getItem('linkedinCredentials') && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex gap-2">
            <span className="text-xl">⚠️</span>
            <div className="text-sm">
              <p className="font-medium text-yellow-900 mb-1">Security Notice</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• Stored locally on your device</li>
                <li>• Sent to backend for automation only</li>
                <li>• Never shared with third parties</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
