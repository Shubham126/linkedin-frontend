import { useState } from 'react';

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  orange: 'from-orange-500 to-orange-600',
  cyan: 'from-cyan-500 to-cyan-600'
};

export default function AutomationCard({ automation, onStart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await automation.action(formData);
      onStart(response.data.jobId);
      setIsOpen(false);
      alert(`Automation started! Job ID: ${response.data.jobId}`);
    } catch (error) {
      alert('Failed to start: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <div className={`h-24 bg-linear-to-r ${colorClasses[automation.color]} flex items-center justify-center`}>
          <span className="text-6xl">{automation.icon}</span>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {automation.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {automation.description}
          </p>
          
          <button
            onClick={() => setIsOpen(true)}
            className={`w-full py-2.5 px-4 rounded-lg text-white font-medium bg-linear-to-r ${colorClasses[automation.color]} hover:opacity-90 transition-opacity`}
          >
            Start Automation
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {automation.name}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {automation.inputs.map((input) => (
                <div key={input.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {input.label}
                  </label>
                  <input
                    type={input.type}
                    defaultValue={input.default}
                    onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              ))}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium bg-linear-to-r ${colorClasses[automation.color]} hover:opacity-90 disabled:opacity-50`}
                >
                  {loading ? 'Starting...' : 'Start'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
