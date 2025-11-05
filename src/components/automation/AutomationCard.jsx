// ==================== FILE: frontend/src/components/automation/AutomationCard.jsx ====================
import { useState } from 'react';

export default function AutomationCard({ automation, disabled = false, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await automation.action(formData);
      setIsOpen(false);
      
      const message = response.data.message || 'Automation started successfully';
      const jobId = response.data.jobId || response.data.data?.jobId || 'N/A';
      
      alert(`✅ ${message}\nJob ID: ${jobId}`);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      alert(`❌ Failed to start: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (disabled) {
      alert('⚠️ A job is already running. Please wait or cancel it first.');
      return;
    }
    
    const initialData = {};
    automation.inputs.forEach(input => {
      initialData[input.name] = input.default;
    });
    setFormData(initialData);
    setIsOpen(true);
  };

  return (
    <>
      <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all ${disabled ? 'opacity-50' : ''}`}>
        {/* Gradient Header */}
        <div className="h-24 flex items-center justify-center" style={{ backgroundColor: automation.color }}>
          <span className="text-6xl">{automation.icon}</span>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {automation.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {automation.description}
          </p>
          
          <button
            onClick={handleOpen}
            disabled={disabled}
            className="w-full py-2.5 px-4 rounded-xl text-white font-medium transition-all hover:shadow-md disabled:cursor-not-allowed"
            style={{
              backgroundColor: disabled ? '#CCCCCC' : automation.color,
              opacity: disabled ? 1 : 1
            }}
          >
            {disabled ? '🔒 Job Running' : '▶️ Start Automation'}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {automation.icon} {automation.name}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {automation.description}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {automation.inputs.length > 0 ? (
                automation.inputs.map((input) => (
                  <div key={input.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      value={formData[input.name] || input.default}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [input.name]: input.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition"
                      style={{ focusRingColor: '#00008B' }}
                      required
                      min={input.type === 'number' ? 1 : undefined}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default: {input.default}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border" style={{ backgroundColor: '#E6E6FA', borderColor: '#00008B' }}>
                  <p className="text-sm" style={{ color: '#00008B' }}>
                    ℹ️ This automation doesn't require any configuration.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl text-white font-medium hover:shadow-md disabled:opacity-50 transition-all"
                  style={{ backgroundColor: automation.color }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Starting...
                    </span>
                  ) : (
                    '▶️ Start Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
