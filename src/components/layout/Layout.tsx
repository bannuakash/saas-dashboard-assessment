import React from 'react';
import { BarChart3, Settings, User, Bell, Menu, X, Loader } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, onNavigate, currentPage = '/' }) => {
  const navItems = [
    { icon: BarChart3, label: 'Campaigns', href: '/' },
    { icon: Loader, label: 'Jobs', href: '/jobs' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const handleNavigate = (href: string) => {
    onNavigate?.(href);
    onClose?.();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 md:hidden z-40'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:z-auto`}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b border-gray-800'>
          <div className='flex items-center gap-2'>
            <BarChart3 className='w-6 h-6' />
            <span className='font-bold text-xl'>Dashboard</span>
          </div>
          {onClose && (
            <button onClick={onClose} className='md:hidden'>
              <X className='w-5 h-5' />
            </button>
          )}
        </div>

        <nav className='flex-1 px-3 py-4 space-y-2'>
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                currentPage === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className='w-5 h-5' />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className='px-3 py-4 border-t border-gray-800'>
          <a
            href='/profile'
            className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
          >
            <User className='w-5 h-5' />
            <span>Profile</span>
          </a>
        </div>
      </aside>
    </>
  );
};

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6'>
      <div className='flex items-center gap-4'>
        <button
          onClick={onMenuClick}
          className='md:hidden text-gray-600 hover:text-gray-900'
        >
          <Menu className='w-6 h-6' />
        </button>
        <h1 className='text-xl font-semibold text-gray-900'>Enterprise SaaS Dashboard</h1>
      </div>

      <div className='flex items-center gap-4'>
        <button className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'>
          <Bell className='w-5 h-5' />
          <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
        </button>
        <div className='h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer hover:bg-blue-600'>
          <User className='w-5 h-5' />
        </div>
      </div>
    </header>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage = '/' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className='flex-1 overflow-auto p-6'>{children}</main>
      </div>
    </div>
  );
};

export { Layout, Sidebar, Header };
