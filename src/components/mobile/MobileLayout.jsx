import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, MapPin, FileText, User, Bell, Menu, X } from 'lucide-react';
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
    { path: '/field-service', icon: MapPin, label: 'Field Service' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const handleNavigation = (path) => {
    vibrate(50); // Haptic feedback
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-primary/20">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold tracking-tight">SP Engineer</h1>
          {isPWA() && (
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              PWA
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-primary-foreground hover:bg-primary-foreground/20 h-10 w-10 p-0 rounded-full"
            onClick={() => handleNavigation('/mobile/notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px] bg-red-500 border-2 border-primary"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/20 h-10 w-10 p-0 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-card shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Navigation</h2>
            </div>
            <nav className="p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start mb-1 ${isActive ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation - Modern Redesign */}
      <nav className="bg-card/95 backdrop-blur-sm border-t border-border px-2 py-2 sticky bottom-0 z-30 shadow-lg">
        <div className="flex justify-around max-w-sm mx-auto">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 py-3 px-4 h-auto min-w-0 rounded-xl transition-all duration-200 ${isActive
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary/20' : ''
                  }`}>
                  <Icon className="h-5 w-5" />
                </div>
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