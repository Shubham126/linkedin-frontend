import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { analytics } from '../../api/linkedinApi';

export default function EngagementChart() {
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'pie'
  const [timeRange, setTimeRange] = useState('7d'); // '7d', '30d', 'all'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagementData();
  }, [timeRange]);

  const loadEngagementData = async () => {
    setLoading(true);
    try {
      const response = await analytics.getRecentActivity(100);
      const activities = response.data.data || [];
      
      // Group by date
      const groupedData = groupActivitiesByDate(activities, timeRange);
      setData(groupedData);
    } catch (error) {
      console.error('Failed to load engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupActivitiesByDate = (activities, range) => {
    const now = new Date();
    const daysToShow = range === '7d' ? 7 : range === '30d' ? 30 : 365;
    
    // Create empty data structure for each day
    const dateMap = {};
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dateMap[dateKey] = { date: dateKey, likes: 0, comments: 0, total: 0 };
    }

    // Fill with actual activity data
    activities.forEach(activity => {
      const dateKey = new Date(activity.timestamp).toISOString().split('T')[0];
      if (dateMap[dateKey]) {
        if (activity.action === 'like') {
          dateMap[dateKey].likes += 1;
        } else if (activity.action === 'comment') {
          dateMap[dateKey].comments += 1;
        }
        dateMap[dateKey].total += 1;
      }
    });

    return Object.values(dateMap).map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

  const pieData = [
    { name: 'Likes', value: data.reduce((sum, d) => sum + d.likes, 0), color: '#3b82f6' },
    { name: 'Comments', value: data.reduce((sum, d) => sum + d.comments, 0), color: '#10b981' }
  ];

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
          <h2 className="text-lg font-semibold text-gray-900">Engagement Trends</h2>
          <p className="text-sm text-gray-500 mt-1">Track your LinkedIn engagement over time</p>
        </div>
        
        <div className="flex gap-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          {/* Chart Type Selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'pie' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pie
            </button>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="likes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Likes" />
            <Line type="monotone" dataKey="comments" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Comments" />
            <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Total" />
          </LineChart>
        )}

        {chartType === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="likes" fill="#3b82f6" name="Likes" />
            <Bar dataKey="comments" fill="#10b981" name="Comments" />
          </BarChart>
        )}

        {chartType === 'pie' && (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>

      {/* Summary Stats Below Chart */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{data.reduce((sum, d) => sum + d.likes, 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Likes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{data.reduce((sum, d) => sum + d.comments, 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Comments</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{data.reduce((sum, d) => sum + d.total, 0)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Actions</p>
        </div>
      </div>
    </div>
  );
}
