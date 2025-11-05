// ==================== FILE: frontend/src/pages/Messages.jsx ====================
import { useEffect, useState } from 'react';
import { logsAPI } from '../api/linkedinApi';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await logsAPI.getMessages();
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.authorName?.toLowerCase().includes(filter.toLowerCase()) ||
    msg.commentText?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💬 Messages Sent</h1>
        <p className="text-gray-500 mt-1">Track all messages you've sent to connections</p>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <input
          type="text"
          placeholder="🔍 Search by recipient or message content..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-xl text-gray-600">No messages found</p>
          <p className="text-gray-500 mt-2">Start sending messages to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((message, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {message.authorName || 'Unknown Recipient'}
                  </h3>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 break-words">
                      {message.commentText || 'No message content'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      ✓ Sent
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <p className="text-2xl">💬</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={loadMessages}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          🔄 Refresh Messages
        </button>
      </div>
    </div>
  );
}
