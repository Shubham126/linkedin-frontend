import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { analytics } from '../../api/linkedinApi';

const COLORS = {
  pending: '#f59e0b',
  accepted: '#10b981',
  directMessaged: '#3b82f6',
  messaged: '#8b5cf6'
};

export default function ConnectionChart() {
  const [stats, setStats] = useState(null);
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('status'); // 'status' or 'timeline'

  useEffect(() => {
    loadConnectionData();
  }, []);

  const loadConnectionData = async () => {
    setLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        analytics.getConnectionStats(),
        analytics.getConnectionHistory()
      ]);

      setStats(statsRes.data.data);
      
      // Process history for timeline
      const history = historyRes.data.data || [];
      const timelineData = processTimelineData(history);
      setConnectionHistory(timelineData);
    } catch (error) {
      console.error('Failed to load connection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTimelineData = (history) => {
    // Group by date
    const dateMap = {};
    
    history.forEach(connection => {
      const dateKey = connection['Date Added']?.split(' ')[0] || new Date().toISOString().split('T')[0];
      
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, connections: 0 };
      }
      dateMap[dateKey].connections += 1;
    });

    return Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 days
      .map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  };

  const statusPieData = stats ? [
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'Accepted', value: stats.accepted, color: COLORS.accepted },
    { name: 'Direct Messaged', value: stats.directMessaged, color: COLORS.directMessaged }
  ].filter(item => item.value > 0) : [];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Connection Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor your LinkedIn network growth</p>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartView('status')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              chartView === 'status' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setChartView('timeline')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              chartView === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartView === 'status' ? (
          <PieChart>
            <Pie
              data={statusPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <AreaChart data={connectionHistory}>
            <defs>
              <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey="connections" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorConnections)" 
              name="New Connections"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 mb-2">
            <span className="text-lg">⏳</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats?.pending || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
            <span className="text-lg">✅</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats?.accepted || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Accepted</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
            <span className="text-lg">💬</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats?.directMessaged || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Messaged</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mb-2">
            <span className="text-lg">👥</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats?.total || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total</p>
        </div>
      </div>
    </div>
  );
}
