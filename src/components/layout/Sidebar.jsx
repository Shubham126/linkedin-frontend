// ==================== FILE: frontend/src/components/layout/Sidebar.jsx ====================
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: '📊',
    description: 'Overview and quick stats'
  },
  { 
    name: 'Automations', 
    href: '/automations', 
    icon: '⚡',
    description: 'Run automation tasks'
  },
  {   
    name: 'Analytics', 
    href: '/analytics', 
    icon: '📈',
    description: 'View engagement stats'
  },
  { 
    name: 'Data', 
    href: '/data', 
    icon: '💾',
    description: 'View scraped data'
  }, 
  { 
    name: 'Connections', 
    href: '/connections', 
    icon: '👥',
    description: 'Manage connections'
  },
  { 
    name: 'Messages', 
    href: '/messages', 
    icon: '💬',
    description: 'View sent messages'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: '⚙️',
    description: 'Configure preferences'
  }
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop - only visible on small screens */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setOpen(false)}
          style={{ transition: 'opacity 0.3s ease' }}
        />
      )}

      {/* Sidebar - Fixed container, full height */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white 
          transition-transform duration-300 ease-in-out flex flex-col
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ 
          borderRight: '1px solid #E6E6FA',
          height: '100vh'
        }}
      >
        {/* Sidebar Header with Hamburger */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#E6E6FA', height: '4rem' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: '#00008B' }}>
              🔗
            </div>
            <span className="font-bold hidden sm:block" style={{ color: '#00008B' }}>Menu</span>
          </div>
          {/* Hamburger Close Button - Show on all screens */}
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
            title="Close Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className="
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-300
                "
                style={{
                  backgroundColor: isActive ? '#00008B' : 'transparent',
                  color: isActive ? 'white' : '#374151',
                  background: isActive 
                    ? '#00008B' 
                    : 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 139, 0) 100%)',
                  backgroundClip: 'padding-box'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 139, 0.1) 0%, rgba(0, 0, 139, 0.05) 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 139, 0) 100%)';
                  }
                }}
                title={item.description}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.name}</span>

                {/* Tooltip on hover (desktop only) */}
                <div 
                  className="
                    absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs 
                    rounded-lg opacity-0 pointer-events-none transition-opacity duration-200
                    group-hover:opacity-100 whitespace-nowrap z-50 hidden lg:group-hover:block
                  "
                >
                  {item.description}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info - Fixed at bottom */}
        <div className="p-4 border-t" style={{ borderColor: '#E6E6FA' }}>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#E6E6FA' }}>
            <div className="text-xs space-y-2">
              <p className="font-semibold" style={{ color: '#00008B' }}>💡 Pro Tip</p>
              <p className="text-gray-600 leading-tight">Use automation responsibly. LinkedIn may limit your account for excessive activity.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
