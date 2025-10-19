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
import avatarSrc from '../../assets/dp-1758538868983-920973171.png';

const MobileDashboard = () => {
  const [stats, setStats] = useState({
    todayAssignments: 0,
    pendingReports: 0,
  });
  const [location, setLocation] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(isOnline());


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
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Schedule</h3>
        <div className="space-y-3">

          {/* Job 1 */}
          <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Install Laboratory Microscope
                  </CardTitle>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Colombo City Lab
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" /> 9:30 AM
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 text-xs">In Progress</Badge>
              </div>

              <div className="mt-3">
                <Button
                  size="sm"
                  className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <PlayCircle className="h-4 w-4" /> Continue Job
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job 2 */}
          <Card className="border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Calibrate PH Meter
                  </CardTitle>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Kandy Research Center
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" /> 11:45 AM
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-700 text-xs">Pending</Badge>
              </div>

              <div className="mt-3">
                <Button
                  size="sm"
                  className="w-full flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <PlayCircle className="h-4 w-4" /> Start Job
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job 3 */}
          <Card className="border-l-4 border-green-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Replace Spectrophotometer Lamp
                  </CardTitle>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Galle Diagnostic Center
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" /> 2:00 PM
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
              </div>

              <div className="mt-3 flex items-center justify-center text-green-600 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-1" /> Completed
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
};

export default MobileDashboard;