import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Cpu } from 'lucide-react';

// Dummy data
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
    dateRange: "20 Oct 2025 - 23 Oct 2025",
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

// --- Helper functions ---

// Parse "20 Oct 2025" into Date
const parseDate = (str) => {
  const [day, month, year] = str.trim().split(' ');
  return new Date(`${month} ${day}, ${year}`);
};

// Get all dates between two dates (inclusive)
const getDateRange = (start, end) => {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Group jobs by each date they span
const groupJobsByDates = (jobs) => {
  const grouped = {};

  jobs.forEach((job) => {
    const [startStr, endStr] = job.dateRange.split('-').map((s) => s.trim());
    const startDate = parseDate(startStr);
    const endDate = parseDate(endStr);

    const dateList = getDateRange(startDate, endDate);
    dateList.forEach((date) => {
      const key = date.toDateString();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(job);
    });
  });

  // Sort by date
  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const sortedGrouped = {};
  sortedKeys.forEach((k) => (sortedGrouped[k] = grouped[k]));
  return sortedGrouped;
};

// Format date section headings
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
  const groupedJobs = groupJobsByDates(jobs);

  return (
    <div className="p-4 space-y-6 pb-20">
      {Object.keys(groupedJobs).map((dateKey) => (
        <div key={dateKey} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
            {getHeadingLabel(dateKey)}
          </h2>

          {groupedJobs[dateKey].map((job) => (
            <Card
              key={`${job.id}-${dateKey}`}
              className="rounded-md shadow-sm border border-gray-200 transition-all cursor-pointer hover:shadow-md"
              role="button"
              tabIndex={0}
              onClick={() => console.log('Job clicked:', job)}
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
      ))}
    </div>
  );
};

export default MobileAssignments;
