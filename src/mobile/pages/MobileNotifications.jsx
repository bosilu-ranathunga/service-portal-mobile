import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Calendar,
  MapPin,
  Settings,
  Check
} from 'lucide-react';
import { notifications } from '@/services/mobileApi';
import { 
  requestNotificationPermission, 
  subscribeToPush,
  vibrate 
} from '@/utils/pwaUtils';
import { format, formatDistanceToNow } from 'date-fns';

const MobileNotifications = () => {
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchNotifications();
    checkNotificationPermission();
  }, []);

  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await notifications.getNotifications(pageNum, 20);
      
      if (append) {
        setNotificationsList(prev => [...prev, ...response.data]);
      } else {
        setNotificationsList(response.data);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const requestPermission = async () => {
    try {
      vibrate(50);
      const granted = await requestNotificationPermission();
      
      if (granted) {
        setPermissionStatus('granted');
        
        // Subscribe to push notifications
        try {
          const subscription = await subscribeToPush();
          await notifications.subscribeToNotifications(subscription);
          alert('Notifications enabled successfully!');
        } catch (error) {
          console.error('Error subscribing to push notifications:', error);
        }
      } else {
        setPermissionStatus('denied');
        alert('Notification permission denied. You can enable it in browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      vibrate(30);
      await notifications.markAsRead(notificationId);
      
      setNotificationsList(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      vibrate(50);
      await notifications.markAllAsRead();
      
      setNotificationsList(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchNotifications(page + 1, true);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'assignment':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'location':
        return <MapPin className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleNotificationAction = async (notification) => {
    vibrate(50);
    
    // Mark as read if not already read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type?.toLowerCase()) {
      case 'assignment':
        if (notification.data?.assignment_id) {
          window.location.href = `/mobile/assignments/${notification.data.assignment_id}`;
        } else {
          window.location.href = '/mobile/assignments';
        }
        break;
      case 'report':
        window.location.href = '/mobile/field-service';
        break;
      default:
        // No specific action for general notifications
        break;
    }
  };

  const unreadCount = notificationsList.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Notification Permission Status */}
      {permissionStatus !== 'granted' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BellOff className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-800">Enable Notifications</h3>
                <p className="text-sm text-orange-700">
                  Get instant alerts for new assignments and updates
                </p>
              </div>
              <Button
                onClick={requestPermission}
                size="sm"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notificationsList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          notificationsList.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read 
                  ? 'border-primary/20 bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleNotificationAction(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium truncate ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h3>
                      
                      {notification.priority && (
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                      )}
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 line-clamp-2 ${
                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                      
                      {notification.data?.assignment_id && (
                        <Badge variant="outline" className="text-xs">
                          Assignment #{notification.data.assignment_id}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Additional metadata */}
                    {notification.data?.location && (
                      <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{notification.data.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action indicator */}
                  <div className="flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileNotifications;