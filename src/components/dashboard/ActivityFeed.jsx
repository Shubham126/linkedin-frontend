export default function ActivityFeed({ activities }) {
  const getActivityIcon = (type) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      connection: '👥',
      message: '✉️',
      scrape: '📋'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No recent activity
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
