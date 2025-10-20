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
            <div className="flex items-center space-x-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {networkStatus ? (
                <Wifi className="h-4 w-4 text-white" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-300" />
              )}
              <span className={`text-sm font-medium ${networkStatus ? 'text-white' : 'text-red-300'}`}>
                {networkStatus ? 'Online' : 'Offline'}
              </span>
            </div>

            {location && (
              <div className="flex items-center space-x-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
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

      {/* Today's Schedule - Compact Card Design */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Schedule</h3>
        <div className="space-y-3">

          {/* Card 1 */}
          <Card className="rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 text-base">Metro Hospital</h4>
                <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5 text-blue-600" /> In Progress
                </span>
              </div>

              <Badge className="mt-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-[11px] font-medium">
                Emergency Repair
              </Badge>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>17:00 - 20:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>789 Healthcare Blvd, Medical District, TC 12347</span>
                </div>
                <p className="mt-1 text-gray-500 text-sm leading-snug">
                  Critical cooling system failure in server room
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 text-base">BioLab Diagnostics</h4>
                <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending
                </span>
              </div>

              <Badge className="mt-2 bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 text-[11px] font-medium">
                Calibration
              </Badge>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>10:00 - 11:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>45 Science Park, Colombo 07</span>
                </div>
                <p className="mt-1 text-gray-500 text-sm leading-snug">
                  Scheduled calibration of spectrometer unit
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 text-base">Central Research Facility</h4>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Completed
                </span>
              </div>

              <Badge className="mt-2 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-[11px] font-medium">
                Preventive Maintenance
              </Badge>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>08:00 - 10:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>21 Lab Street, Galle</span>
                </div>
                <p className="mt-1 text-gray-500 text-sm leading-snug">
                  Completed preventive maintenance for centrifuge machine
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>


    </div>
  );
};

export default MobileDashboard;