import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { isPWA, vibrate } from '@/utils/pwaUtils';

// Dummy data
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
  {
    id: "JOB127",
    customer: "AeroTech Solutions",
    department: "Aerospace",
    jobType: "Emergency Repair",
    dateRange: "25 Oct 2025 - 26 Oct 2025",
    instrument: "Altimeter",
    description: "Repair altimeter and run performance tests.",
    location: "Client Site",
    status: "Pending"
  },
  {
    id: "JOB128",
    customer: "Quantum Labs",
    department: "Electronics",
    jobType: "Calibration",
    dateRange: "26 Oct 2025 - 27 Oct 2025",
    instrument: "Power Supply Unit",
    description: "Routine calibration of lab power supply units.",
    location: "Warehouse",
    status: "Pending"
  },
  {
    id: "JOB129",
    customer: "Nova Instruments",
    department: "Mechanical",
    jobType: "Emergency Repair",
    dateRange: "27 Oct 2025 - 28 Oct 2025",
    instrument: "Hydraulic Pump",
    description: "Emergency hydraulic pump repair and testing.",
    location: "Client Site",
    status: "Pending"
  },
  {
    id: "JOB130",
    customer: "Stellar Electronics",
    department: "Electrical",
    jobType: "Calibration",
    dateRange: "28 Oct 2025 - 29 Oct 2025",
    instrument: "Multimeter",
    description: "Calibration of multimeters for quality assurance lab.",
    location: "Warehouse",
    status: "Pending"
  }
];


// --- Helper functions ---

const parseDate = (str) => {
  const [day, month, year] = str.trim().split(' ');
  return new Date(`${month} ${day}, ${year}`);
};

const getDateRange = (start, end) => {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const groupJobsByDates = (jobs) => {
  const grouped = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  jobs.forEach((job) => {
    const [startStr, endStr] = job.dateRange.split('-').map((s) => s.trim());
    const startDate = parseDate(startStr);
    const endDate = parseDate(endStr);

    if (endDate < today) return;

    const actualStart = startDate < today ? today : startDate;
    const dateList = getDateRange(actualStart, endDate);
    dateList.forEach((date) => {
      const key = date.toDateString();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(job);
    });
  });

  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const sortedGrouped = {};
  sortedKeys.forEach((k) => (sortedGrouped[k] = grouped[k]));
  return sortedGrouped;
};

const getHeadingLabel = (dateString) => {
  const jobDate = new Date(dateString);
  const today = new Date();
  const diffDays = Math.floor(
    (jobDate - new Date(today.getFullYear(), today.getMonth(), today.getDate())) /
    (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today's Jobs";
  if (diffDays === 1) return "Tomorrow's Jobs";
  return jobDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// --- Component ---
const MobileAssignments = () => {
  const navigate = useNavigate();
  const groupedJobs = groupJobsByDates(jobs);

  // ✅ Navigation handler
  const handleCardClick = (assignment) => {
    vibrate(50);
    navigate('/job', { state: { assignment } });
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {Object.keys(groupedJobs).map((dateKey) => (
        <div key={dateKey} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 flex justify-between items-center">
            <span>
              {getHeadingLabel(dateKey)} ({groupedJobs[dateKey].length} Job{groupedJobs[dateKey].length > 1 ? 's' : ''})
            </span>

          </h2>


          {groupedJobs[dateKey].map((job) => (
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
      ))}
    </div>
  );
};

export default MobileAssignments;
