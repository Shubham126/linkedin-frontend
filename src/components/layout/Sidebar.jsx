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
  // { 
  //   name: 'Create Post', 
  //   href: '/create-post', 
  //   icon: '✍️',
  //   description: 'Create and schedule posts'
  // },
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
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-900/80 lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
      `}>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={item.description}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-lg" />
                )}
                
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.name}</span>

                {/* Tooltip on hover (desktop) */}
                <div className="
                  absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs 
                  rounded opacity-0 pointer-events-none transition-opacity duration-200
                  group-hover:opacity-100 whitespace-nowrap z-10 hidden lg:block
                ">
                  {item.description}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-t from-blue-50 to-transparent">
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-700">💡 Pro Tip</p>
            <p>Use automation responsibly. LinkedIn may limit your account for excessive activity.</p>
          </div>
        </div>
      </div>
    </>
  );
}
