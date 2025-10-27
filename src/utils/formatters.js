// Date formatting
export function formatDate(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTimeAgo(date) {
  if (!date) return 'N/A';
  
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
}

// Number formatting
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatPercentage(num, decimals = 1) {
  if (num === null || num === undefined) return '0%';
  return `${Number(num).toFixed(decimals)}%`;
}

// Status formatting
export function getStatusColor(status) {
  const colors = {
    running: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    stopped: 'bg-gray-100 text-gray-800'
  };
  
  return colors[status?.toLowerCase()] || colors.pending;
}

export function getStatusIcon(status) {
  const icons = {
    running: '⚡',
    completed: '✅',
    failed: '❌',
    pending: '⏳',
    stopped: '⏸️'
  };
  
  return icons[status?.toLowerCase()] || '📌';
}

// Profile URL formatting
export function extractLinkedInUsername(url) {
  if (!url) return 'N/A';
  
  const match = url.match(/linkedin\.com\/in\/([^/]+)/);
  return match ? match[1] : url;
}
