import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, MapPin, FileText, User, Bell, Menu, X, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notifications } from '@/services/mobileApi';
import { isPWA, vibrate } from '@/utils/pwaUtils';

const MobileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      try {
        const response = await notifications.getNotifications(1, 1);
        setUnreadCount(response.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/assignments', icon: Calendar, label: 'Assignments' },
    { path: '/field-service', icon: FileText, label: 'Field Service' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const handleNavigation = (path) => {
    vibrate(50); // Haptic feedback
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/') && location.pathname.split('/')[2] !== undefined;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Mobile Header */}
      <header className="bg-blue-500 text-primary-foreground px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-primary/20">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold">Service Pro</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Menu Toggle */}
          <EllipsisVertical size={24} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#f3f4f6]">
        <Outlet />
      </main>

      {/* Bottom Navigation - Modern Redesign */}
      <nav className="bg-card/95 backdrop-blur-sm border-t border-border px-2 py-2 sticky bottom-0 z-30 shadow-lg">
        <div className="flex justify-around max-w-sm mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 py-3 px-4 h-auto min-w-0 rounded-xl transition-all duration-200 ${isActive
                  ? 'text-blue-600'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default MobileLayout;