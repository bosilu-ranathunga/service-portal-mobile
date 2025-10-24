import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, FileText } from 'lucide-react';

// Clickable Row component
const ClickableRow = ({ label, description, icon: Icon, onClick }) => (
  <button
    onClick={(e) => {
      if (navigator?.vibrate) navigator.vibrate(50);
      if (onClick) onClick(e);
    }}
    className="flex items-center w-full py-4 space-x-4 group text-left"
  >
    {Icon && (
      <Icon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
    )}

    <div className="flex-1">
      <p className="text-base font-medium group-hover:text-primary transition-colors">
        {label}
      </p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <ChevronRight className="w-5 h-5 text-muted-foreground" />
  </button>
);

const MobileFieldService = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const dummyReports = [
      {
        id: 'FRS-001',
        service: 'Pressure Gauge Check',
        date: '22 Oct 2025',
        status: 'Completed'
      },
      {
        id: 'FRS-002',
        service: 'Motor Calibration',
        date: '20 Oct 2025',
        status: 'In Progress'
      },
      {
        id: 'FRS-003',
        service: 'Sensor Replacement',
        date: '18 Oct 2025',
        status: 'Pending'
      }
    ];

    setReports(dummyReports);
  }, []);

  const handleClick = (reportId) => {
    console.log("Navigate to FRS:", reportId);
    // Add navigate(`/fsr/${reportId}`) here if using React Router
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Field Service Reports</h1>
      </div>

      <Card className="rounded-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Service History</CardTitle>
        </CardHeader>

        <CardContent className="divide-y pt-0">
          {reports.map((r) => (
            <ClickableRow
              key={r.id}
              label={r.service}
              description={`Date: ${r.date} | ID: ${r.id}`}
              icon={FileText}
              onClick={() => handleClick(r.id)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <button
        onClick={() => console.log("Create New Report")}
        className="fixed bottom-20 right-6 bg-blue-600 text-white font-bold text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        +
      </button>
    </div>
  );
};

export default MobileFieldService;
