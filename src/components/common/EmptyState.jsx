export default function EmptyState({ 
  icon = '📭', 
  title = 'No data available', 
  description = null,
  action = null 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
