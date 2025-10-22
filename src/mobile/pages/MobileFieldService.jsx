import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fieldService } from '@/services/mobileApi';

const MobileFieldService = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await fieldService.getReports(); // Assuming getReports fetches the FRS data
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Field Service Reports</h1>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          New Report
        </Button>
      </div>

      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{report.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge>{report.status}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default MobileFieldService;