import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationPrompt } from './NotificationPrompt';
import { ForegroundNotifications } from './ForegroundNotifications';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Topbar
        isMenuOpen={isMobileMenuOpen}
        onMenuToggle={handleMenuToggle}
      />
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={handleMenuClose}
      />
      <main className="flex-1 lg:ml-[280px] bg-chnebel-gray min-h-screen pt-16 lg:pt-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-4 lg:p-8 bg-white rounded-lg mt-4 lg:mt-8 mb-4 lg:mb-8 shadow-sm overflow-hidden">
          {children}
        </div>
      </main>
      <NotificationPrompt />
      <ForegroundNotifications />
    </div>
  );
};

