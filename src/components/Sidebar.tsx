import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SeasonSelector } from './SeasonSelector';
import logo from '../assets/chnebel-logo-transparent.png';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, onMobileMenuClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/info', label: 'Info', icon: 'ℹ️' },
    { path: '/events', label: 'Events', icon: '📅' },
    { path: '/spieler', label: 'Spieler', icon: '👥' },
    { path: '/verfassung', label: 'Verfassung', icon: '📜' },
    { path: '/patchsystem', label: 'Patchsystem', icon: '🔧' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    onMobileMenuClose();
  }, [location.pathname, onMobileMenuClose]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onMobileMenuClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onMobileMenuClose]);

  return (
    <>
      {/* Overlay - Mobile Only */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] transition-opacity duration-300"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-[280px] bg-gradient-to-b from-chnebel-black to-[#1a1a1a] 
          flex flex-col fixed left-0 z-[50]
          shadow-2xl border-r border-white/10
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-0 lg:h-screen
          top-16 h-[calc(100vh-4rem)]
          ${isMobileMenuOpen 
            ? 'translate-x-0' 
            : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Header with Logo + Fire Effect */}
        <div className="sidebar-fire pt-5 px-5 pb-3 flex flex-col items-center gap-2 flex-shrink-0">
          <img
            src={logo}
            alt="Chnebel Logo"
            className="w-32 h-32 object-contain relative z-10"
          />
          <div className="text-center relative z-10">
            <h1 className="text-white text-xl font-bold leading-tight m-0 drop-shadow-lg">
              GemschiHub
            </h1>
          </div>
          <div className="sidebar-fire-fade" />
        </div>

        {/* Season Selector */}
        <SeasonSelector />

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-lg
                  text-white no-underline transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white font-semibold shadow-lg shadow-chnebel-red/30'
                    : 'hover:bg-white/10 hover:text-white'
                  }
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                )}
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </Link>
            );
          })}
          
          {isAdmin && (
            <Link
              to="/admin"
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-lg mt-auto
                text-white no-underline transition-all duration-200 text-sm
                ${location.pathname === '/admin'
                  ? 'bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white font-semibold shadow-lg'
                  : 'hover:bg-white/10 opacity-90'
                }
                transform hover:scale-[1.02] border-t border-white/10 pt-4
              `}
            >
              <span className="text-lg">⚙️</span>
              <span className="flex-1">Admin</span>
              {location.pathname === '/admin' && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent">
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chnebel-red to-[#c4161e] flex items-center justify-center text-white font-semibold shadow-lg">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {user.email.split('@')[0]}
                  </div>
                  <div className="text-white/60 text-xs truncate">
                    {isAdmin ? 'Captain' : 'Eingeloggt'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white border-none px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:from-[#c4161e] hover:to-chnebel-red shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block w-full bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white border-none px-4 py-2.5 rounded-lg text-sm font-semibold text-center no-underline cursor-pointer transition-all duration-200 hover:from-[#c4161e] hover:to-chnebel-red shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              🔑 Captain Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
