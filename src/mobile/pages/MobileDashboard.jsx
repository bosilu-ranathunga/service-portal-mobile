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
  Building2,
  Hash,
  Navigation,
  PlayCircle,
  Wrench,
  Loader
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
    todayAssignments: 4,
    pendingReports: 3,
  });
  const [location, setLocation] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(isOnline());

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#2b7fff");
  }, []);

  const jobs = [
    {
      id: "JOB123",
      customer: "ABC Industries",
      department: "Mechanical",
      jobType: "Emergency Repair",
      dateRange: "20 Oct 2025 - 21 Oct 2025",
      instrument: "Pressure Gauge",
      description: "Replace faulty pressure gauge and recalibrate system.",
      location: "Client Site",
      status: "In Progress"
    },
    {
      id: "JOB124",
      customer: "XYZ Laboratories",
      department: "Electrical",
      jobType: "Calibration",
      dateRange: "22 Oct 2025 - 23 Oct 2025",
      instrument: "Digital Multimeter",
      description: "Perform routine calibration of digital multimeters.",
      location: "Warehouse",
      status: "Pending"
    },
    {
      id: "JOB125",
      customer: "Global Tech",
      department: "Electronics",
      jobType: "Emergency Repair",
      dateRange: "23 Oct 2025 - 24 Oct 2025",
      instrument: "Oscilloscope",
      description: "Fix and recalibrate the oscilloscope for testing lab.",
      location: "Client Site",
      status: "Pending FSR"
    },
    {
      id: "JOB126",
      customer: "Sunrise Pharma",
      department: "Mechanical",
      jobType: "Calibration",
      dateRange: "24 Oct 2025 - 25 Oct 2025",
      instrument: "Temperature Sensor",
      description: "Check and calibrate temperature sensors in production line.",
      location: "Warehouse",
      status: "Job Done"
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
      <Card className="rounded-sm bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 border-blue-500 overflow-hidden relative">
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

        <Card className="rounded-sm">
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

        <Card className="rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-700">{stats.pendingReports}</div>
                <div className="text-xs font-medium text-amber-600 mt-1">Pending FSR</div>
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
              className="rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(job)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCardClick(job);
              }}
            >
              <CardContent className="p-4">
                {/* === Top Row === */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">
                      {job.customer}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.department}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">#{job.id}</span>
                </div>

                {/* === Info Section === */}
                <div className="mt-3 space-y-1.5 text-sm text-gray-700">

                  {/* Date Range */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {job.dateRange}
                    </span>
                  </div>

                  {/* Instrument */}
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{job.instrument}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">

                  {/* Location Tag */}
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    {job.location}
                  </span>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${job.status === "Pending"
                      ? "bg-gray-100 text-gray-700"
                      : job.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : job.status === "Pending FSR"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {job.status === "In Progress" && (
                      <Loader className="h-3 w-3 text-blue-700 animate-spin" />
                    )}
                    {job.status}
                  </span>
                </div>

                {/* === Description === */}
                {job.description && (
                  <p className="mt-3 text-gray-500 text-sm leading-snug line-clamp-2">
                    {job.description}
                  </p>
                )}


              </CardContent>
            </Card>
          ))}
        </div>
      </div>


    </div>
  );
};

export default MobileDashboard;