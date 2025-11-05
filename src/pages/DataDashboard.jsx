// ==================== FILE: frontend/src/pages/DataDashboard.jsx ====================
import { useState, useEffect } from 'react';
import { logsAPI } from '../api/linkedinApi';

export default function DataDashboard() {
  const [activeTab, setActiveTab] = useState('activities');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (tab) => {
    setLoading(true);
    try {
      let response;
      
      switch(tab) {
        case 'activities':
          response = await logsAPI.getUserLogs();
          break;
        case 'likes':
          response = await logsAPI.getLikes();
          break;
        case 'comments':
          response = await logsAPI.getComments();
          break;
        case 'connections':
          response = await logsAPI.getConnectionRequests();
          break;
        case 'messages':
          response = await logsAPI.getMessages();
          break;
        case 'accepted':
          response = await logsAPI.getConnectionAccepted();
          break;
        default:
          response = await logsAPI.getUserLogs();
      }
      
      setData(response.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const response = await logsAPI.downloadCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `linkedin-data-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
      alert('✅ CSV downloaded successfully!');
    } catch (error) {
      console.error('Failed to download:', error);
      alert('❌ Failed to download CSV');
    } finally {
      setDownloading(false);
    }
  };

  const tabs = [
    { id: 'activities', name: '📊 All Activities', count: 0 },
    { id: 'likes', name: '👍 Likes', count: 0 },
    { id: 'comments', name: '💬 Comments', count: 0 },
    { id: 'connections', name: '🤝 Connections', count: 0 },
    { id: 'messages', name: '💬 Messages', count: 0 },
    { id: 'accepted', name: '✅ Accepted', count: 0 }
  ];

  const getColumns = () => {
    if (data.length === 0) return [];
    const first = data[0];
    return Object.keys(first).filter(key => key !== '_id' && key !== '__v' && key !== 'linkedinUsername');
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (value instanceof Date || typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  };

  const columns = getColumns();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Data Dashboard</h1>
          <p className="text-gray-600">MongoDB Activity Logs - Direct Data View</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.name}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({data.length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600">No data found</p>
              <p className="text-gray-500 mt-2">Start an automation to collect data</p>
            </div>
          ) : (
            <>
              {/* CSV Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">No.</th>
                      {columns.map((col) => (
                        <th key={col} className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                          {col
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          {idx + 1}
                        </td>
                        {columns.map((col) => (
                          <td 
                            key={`${idx}-${col}`} 
                            className="px-6 py-4 text-gray-700 max-w-xs overflow-hidden text-ellipsis"
                            title={String(row[col])}
                          >
                            {formatValue(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-gray-700">
                  <span className="font-semibold">Total Records:</span> {data.length}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Download Button */}
        {data.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDownloadCSV}
              disabled={downloading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              <span className="text-xl">📥</span>
              {downloading ? 'Downloading...' : 'Download CSV'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
