import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Cpu,
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


  const jobs = [
    {
      id: "metro-1",
      customer: "Metro Hospital",
      department: "Facilities Management",
      instrument: "UV-Vis Spectrophotometer",
      jobType: "Emergency Repair",
      dateRange: "20 Oct 2025 - 21 Oct 2025",
      description:
        "Critical cooling system failure in spectrophotometer affecting optical stability and performance...",
      status: "in_progress",
    },
    {
      id: "greenlab-2",
      customer: "GreenLab Diagnostics",
      department: "QC Department",
      instrument: "HPLC System",
      jobType: "Preventive Maintenance",
      dateRange: "22 Oct 2025 - 23 Oct 2025",
      description:
        "Scheduled preventive maintenance to replace worn pump seals and recalibrate the detector.",
      status: "pending",
    },
    {
      id: "biohealth-3",
      customer: "BioHealth Research Center",
      department: "Analytical Chemistry",
      instrument: "GC-MS Analyzer",
      jobType: "Calibration",
      dateRange: "24 Oct 2025 - 25 Oct 2025",
      description:
        "Calibration of GC-MS detector to ensure accurate mass detection and baseline stabilization.",
      status: "completed",
    },
  ];


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

  const navigate = useNavigate();
  const handleCardClick = (assignment) => {
    vibrate(50);
    navigate('/job', { state: { assignment } });
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

        <Card className="rounded-md">
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

        <Card className="rounded-md">
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
          {jobs.map((job) => (


            <Card
              key={job.id}
              className="rounded-md shadow-sm border border-gray-200 transition-all cursor-pointer hover:shadow-md"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(job)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCardClick(job);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">
                      {job.customer}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.department}
                    </p>
                  </div>

                  <Badge
                    className={`mt-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${job.jobType === "Emergency Repair"
                      ? "bg-red-100 text-red-700"
                      : job.jobType === "Calibration"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {job.jobType}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{job.dateRange}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-gray-500" />
                    <span>{job.instrument}</span>
                  </div>

                  <p className="mt-3 text-gray-500 text-sm leading-snug line-clamp-2">
                    {job.description}
                  </p>
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