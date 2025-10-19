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
    <div className="p-4 space-y-4 pb-24 bg-gray-50 min-h-screen">

      {/* Greeting Header */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{getGreeting()} 👋</h2>
              <p className="text-gray-500 text-sm mt-1">
                Here’s a quick look at your day
              </p>
            </div>
            <Avatar className="h-12 w-12 border border-gray-200 shadow-sm">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} />
              ) : (
                <AvatarFallback>EN</AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center flex-wrap gap-3 mt-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${networkStatus ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'
              }`}>
              {networkStatus ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              {networkStatus ? 'Online' : 'Offline'}
            </div>

            {location && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-medium">
                <Navigation className="h-4 w-4" /> GPS Active
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-800">{stats.todayAssignments}</div>
                <div className="text-sm text-gray-500 mt-1">Today's Jobs</div>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-800">{stats.pendingReports}</div>
                <div className="text-sm text-gray-500 mt-1">Pending Reports</div>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">Today's Schedule</h3>
        <div className="space-y-3">

          {/* Job Card */}
          {[
            {
              title: 'Metro Hospital',
              status: 'In Progress',
              statusColor: 'text-blue-600',
              badgeColor: 'bg-blue-50 text-blue-700',
              badgeText: 'Emergency Repair',
              time: '17:00 - 20:00',
              location: '789 Healthcare Blvd, Medical District, TC 12347',
              description: 'Critical cooling system failure in server room',
              icon: <PlayCircle className="h-3.5 w-3.5 text-blue-600" />,
            },
            {
              title: 'BioLab Diagnostics',
              status: 'Pending',
              statusColor: 'text-amber-600',
              badgeColor: 'bg-amber-50 text-amber-700',
              badgeText: 'Calibration',
              time: '10:00 - 11:30',
              location: '45 Science Park, Colombo 07',
              description: 'Scheduled calibration of spectrometer unit',
              icon: <Clock className="h-3.5 w-3.5 text-amber-600" />,
            },
            {
              title: 'Central Research Facility',
              status: 'Completed',
              statusColor: 'text-green-600',
              badgeColor: 'bg-green-50 text-green-700',
              badgeText: 'Preventive Maintenance',
              time: '08:00 - 10:00',
              location: '21 Lab Street, Galle',
              description: 'Preventive maintenance for centrifuge machine completed',
              icon: <CheckCircle className="h-3.5 w-3.5 text-green-600" />,
            },
          ].map((job, i) => (
            <Card
              key={i}
              className="rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800 text-base">{job.title}</h4>
                  <span className={`text-xs font-medium flex items-center gap-1 ${job.statusColor}`}>
                    {job.icon} {job.status}
                  </span>
                </div>

                <Badge className={`mt-2 ${job.badgeColor} rounded-full px-2 py-0.5 text-[11px] font-medium`}>
                  {job.badgeText}
                </Badge>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{job.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm leading-snug">{job.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

};

export default MobileDashboard;