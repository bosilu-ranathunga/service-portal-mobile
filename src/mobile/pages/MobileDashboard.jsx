import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Battery,
  Wifi,
  WifiOff,
  Navigation,
  PlayCircle
} from 'lucide-react';
import { dashboard, assignments } from '@/services/mobileApi';
import {
  getCurrentLocation,
  getBatteryInfo,
  isOnline,
  onNetworkChange,
  vibrate
} from '@/utils/pwaUtils';
import { format } from 'date-fns';
import avatarSrc from '../../assets/icon-192.png';

const MobileDashboard = () => {
  const [stats, setStats] = useState({
    todayAssignments: 0,
    completedToday: 0,
    pendingReports: 0,
    totalDistance: 0
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [batteryInfo, setBatteryInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(isOnline());
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const [statsData, scheduleData, activityData] = await Promise.all([
          dashboard.getStats(),
          dashboard.getTodaySchedule(),
          dashboard.getRecentActivity()
        ]);

        setStats(statsData);
        setTodaySchedule(scheduleData);
        setRecentActivity(activityData);

        // Get device info
        const battery = await getBatteryInfo();
        setBatteryInfo(battery);

        // Get current location
        try {
          const currentLocation = await getCurrentLocation();
          setLocation(currentLocation);
        } catch (error) {
          console.log('Location access denied or unavailable');
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Network status listener
    const networkCleanup = onNetworkChange(setNetworkStatus);

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      // Note: networkCleanup would be implemented if onNetworkChange returned a cleanup function
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleQuickAction = (action, data = null) => {
    vibrate(50);

    switch (action) {
      case 'start_work':
        // Navigate to assignment details
        window.location.href = `/mobile/assignments/${data.id}`;
        break;
      case 'view_route':
        // Open maps with route
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.address)}`;
        window.open(mapsUrl, '_blank');
        break;
      case 'create_report':
        window.location.href = '/mobile/field-service/new-report';
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        {/* Header Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 w-32 loading-shimmer rounded"></div>
                <div className="h-4 w-48 loading-shimmer rounded"></div>
              </div>
              <div className="h-12 w-12 loading-shimmer rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-8 w-12 loading-shimmer rounded"></div>
                  <div className="h-4 w-20 loading-shimmer rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-40 loading-shimmer rounded"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-32 loading-shimmer rounded"></div>
                    <div className="h-4 w-20 loading-shimmer rounded"></div>
                  </div>
                  <div className="h-6 w-16 loading-shimmer rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 loading-shimmer rounded"></div>
                  <div className="h-4 w-full loading-shimmer rounded"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">

      {/* Greeting Header - Modern Redesign */}
      <Card className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 border-blue-500 overflow-hidden relative">
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{getGreeting()}!</h2>
              <p className="text-primary-foreground/90 text-base">Ready for today's assignments?</p>
            </div>
            <Avatar className="h-14 w-14 border-3 border-primary-foreground/30 shadow-lg">
              <AvatarImage src={localStorage.getItem('engineer_avatar') || "/avatar-placeholder.png"} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-semibold">
                EN
              </AvatarFallback>
            </Avatar>
            <Avatar
              className="h-14 w-14 border-3 border-primary-foreground/30 shadow-lg cursor-pointer">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} />
              ) : (
                <>
                  <AvatarImage src={"/avatar-placeholder.png"} />
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-semibold">
                    EN
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </div>

          {/* Device Status Bar - Enhanced */}
          <div className="flex items-center flex-wrap gap-3 mt-4">
            <div className="flex items-center space-x-2 bg-primary-foreground/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {networkStatus ? (
                <Wifi className="h-4 w-4 text-green-300" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-300" />
              )}
              <span className={`text-sm font-medium ${networkStatus ? 'text-green-300' : 'text-red-300'}`}>
                {networkStatus ? 'Online' : 'Offline'}
              </span>
            </div>

            {location && (
              <div className="flex items-center space-x-2 bg-primary-foreground/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Navigation className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium text-purple-300">GPS Active</span>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Modern Redesign */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700">{stats.todayAssignments}</div>
                <div className="text-xs font-medium text-blue-600 mt-1">Today's Jobs</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-700">{stats.pendingReports}</div>
                <div className="text-xs font-medium text-amber-600 mt-1">Pending Reports</div>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Today's Schedule - Modern Redesign */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-semibold">Today's Schedule</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {todaySchedule.length} {todaySchedule.length === 1 ? 'job' : 'jobs'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {todaySchedule.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No assignments for today</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Enjoy your free day!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {todaySchedule.map((assignment, index) => (
                <div key={assignment.id} className="p-4 hover:bg-muted/30 transition-colors">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(assignment.status)} shadow-sm`}></div>
                      <div>
                        <h3 className="font-semibold text-base leading-tight">{assignment.customer_name}</h3>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs px-2 py-0.5 bg-primary/5 text-primary border-primary/20"
                        >
                          {assignment.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      className={`text-xs capitalize ${assignment.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                    >
                      {assignment.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Time and Location Row */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center space-x-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {format(new Date(assignment.scheduled_time), 'HH:mm')}
                        </span>
                        {assignment.estimated_end_time && (
                          <>
                            <span className="text-muted-foreground/60">-</span>
                            <span className="font-medium">
                              {format(new Date(assignment.estimated_end_time), 'HH:mm')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-1.5 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground leading-relaxed break-words">
                        {assignment.location}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {assignment.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction('start_work', assignment)}
                        className="flex-1 h-9 bg-primary hover:bg-primary/90 text-white"
                      >
                        <PlayCircle className="h-4 w-4 mr-1.5" />
                        Start Work
                      </Button>
                    )}

                    {assignment.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAction('start_work', assignment)}
                        className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        In Progress
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction('view_route', assignment)}
                      className="h-9 px-4 border-primary/20 text-primary hover:bg-primary/5"
                    >
                      <Navigation className="h-4 w-4 mr-1.5" />
                      Navigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default MobileDashboard;