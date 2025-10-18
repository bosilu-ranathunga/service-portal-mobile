import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Camera, 
  MapPin, 
  Clock, 
  FileText, 
  Upload,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { fieldService, assignments } from '@/services/mobileApi';
import { 
  pickPhoto, 
  getCurrentLocation, 
  vibrate,
  storeOfflineData,
  getOfflineData,
  isOnline
} from '@/utils/pwaUtils';
import { format } from 'date-fns';

const MobileFieldService = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form state for new report
  const [reportForm, setReportForm] = useState({
    assignment_id: '',
    type: '',
    description: '',
    findings: '',
    recommendations: '',
    work_performed: '',
    parts_used: [],
    hours_spent: '',
    customer_signature: '',
    engineer_notes: '',
    photos: []
  });

  const [newPart, setNewPart] = useState({ name: '', quantity: '', part_number: '' });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchInitialData();
    getCurrentLocationData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, reportsData] = await Promise.all([
        assignments.getAssignments('in_progress'),
        fieldService.getReports({ limit: 10 })
      ]);
      
      setAssignments(assignmentsData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationData = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
    } catch (error) {
      console.log('Location access denied');
    }
  };

  const handlePhotoCapture = async () => {
    try {
      vibrate(50);
      const photo = await pickPhoto();
      
      if (photo) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now(),
            url: e.target.result,
            file: photo,
            caption: ''
          };
          
          setReportForm(prev => ({
            ...prev,
            photos: [...prev.photos, newPhoto]
          }));
        };
        reader.readAsDataURL(photo);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const removePhoto = (photoId) => {
    vibrate(50);
    setReportForm(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const updatePhotoCaption = (photoId, caption) => {
    setReportForm(prev => ({
      ...prev,
      photos: prev.photos.map(photo => 
        photo.id === photoId ? { ...photo, caption } : photo
      )
    }));
  };

  const addPart = () => {
    if (newPart.name && newPart.quantity) {
      vibrate(50);
      setReportForm(prev => ({
        ...prev,
        parts_used: [...prev.parts_used, { ...newPart, id: Date.now() }]
      }));
      setNewPart({ name: '', quantity: '', part_number: '' });
    }
  };

  const removePart = (partId) => {
    vibrate(50);
    setReportForm(prev => ({
      ...prev,
      parts_used: prev.parts_used.filter(part => part.id !== partId)
    }));
  };

  const handleSubmitReport = async () => {
    try {
      // Validate required fields
      if (!reportForm.assignment_id) {
        alert('Please select an assignment');
        vibrate(200);
        return;
      }
      
      if (!reportForm.type) {
        alert('Please select a report type');
        vibrate(200);
        return;
      }
      
      if (!reportForm.description.trim()) {
        alert('Please enter a description');
        vibrate(200);
        return;
      }

      setLoading(true);
      vibrate(100);

      const reportData = {
        ...reportForm,
        location,
        created_at: new Date().toISOString(),
        status: 'completed'
      };

      console.log('Submitting report:', reportData);

      if (isOnline()) {
        // Submit online
        const response = await fieldService.createReport(reportData);
        console.log('Report created:', response);
        
        // Upload photos if any
        if (reportForm.photos.length > 0) {
          for (const photo of reportForm.photos) {
            if (photo.file) {
              try {
                await fieldService.uploadPhoto(response.id, photo.file);
                console.log('Photo uploaded:', photo.caption);
              } catch (photoError) {
                console.error('Error uploading photo:', photoError);
              }
            }
          }
        }
        
        alert('Report submitted successfully!');
      } else {
        // Store offline
        storeOfflineData(`report_${Date.now()}`, reportData);
        alert('Report saved offline. Will sync when online.');
      }

      // Reset form
      setReportForm({
        assignment_id: '',
        type: '',
        description: '',
        findings: '',
        recommendations: '',
        work_performed: '',
        parts_used: [],
        hours_spent: '',
        customer_signature: '',
        engineer_notes: '',
        photos: []
      });
      
      setSelectedAssignment(null);

      // Refresh data
      await fetchInitialData();
      
      // Switch back to reports list
      setActiveTab('reports');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report: ' + (error.message || 'Please try again.'));
      vibrate([100, 50, 100]);
    } finally {
      setLoading(false);
    }
  };

  const getReportTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'installation': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderReportsList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Field Reports</h2>
        <Button
          onClick={() => setActiveTab('new-report')}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first field service report
            </p>
            <Button onClick={() => setActiveTab('new-report')}>
              Create Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{report.customer_name}</h3>
                  <Badge className={getReportTypeColor(report.type)}>
                    {report.type}
                  </Badge>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(report.created_at), 'MMM dd, HH:mm')}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {report.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{report.hours_spent}h worked</span>
                  {report.parts_used?.length > 0 && (
                    <span>{report.parts_used.length} parts used</span>
                  )}
                  {report.photos?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <ImageIcon className="h-3 w-3" />
                      <span>{report.photos.length}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {report.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderNewReportForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">New Field Report</h2>
        <Button
          variant="outline"
          onClick={() => setActiveTab('reports')}
          size="sm"
        >
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assignment">Select Assignment</Label>
            <Select 
              value={reportForm.assignment_id} 
              onValueChange={(value) => {
                setReportForm(prev => ({ ...prev, assignment_id: value }));
                const assignment = assignments.find(a => a.id === value);
                setSelectedAssignment(assignment);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.customer_name} - {assignment.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Report Type</Label>
            <Select 
              value={reportForm.type} 
              onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the work performed..."
              value={reportForm.description}
              onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="work_performed">Work Performed</Label>
            <Textarea
              id="work_performed"
              placeholder="Detailed description of work performed..."
              value={reportForm.work_performed}
              onChange={(e) => setReportForm(prev => ({ ...prev, work_performed: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="findings">Findings</Label>
            <Textarea
              id="findings"
              placeholder="Issues found during the work..."
              value={reportForm.findings}
              onChange={(e) => setReportForm(prev => ({ ...prev, findings: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="recommendations">Recommendations</Label>
            <Textarea
              id="recommendations"
              placeholder="Recommendations for future maintenance..."
              value={reportForm.recommendations}
              onChange={(e) => setReportForm(prev => ({ ...prev, recommendations: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="hours_spent">Hours Spent</Label>
            <Input
              id="hours_spent"
              type="number"
              step="0.5"
              placeholder="0.0"
              value={reportForm.hours_spent}
              onChange={(e) => setReportForm(prev => ({ ...prev, hours_spent: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parts Used Section */}
      <Card>
        <CardHeader>
          <CardTitle>Parts Used</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Input
              placeholder="Part name"
              value={newPart.name}
              onChange={(e) => setNewPart(prev => ({ ...prev, name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Quantity"
                type="number"
                value={newPart.quantity}
                onChange={(e) => setNewPart(prev => ({ ...prev, quantity: e.target.value }))}
              />
              <Input
                placeholder="Part number"
                value={newPart.part_number}
                onChange={(e) => setNewPart(prev => ({ ...prev, part_number: e.target.value }))}
              />
            </div>
            <Button onClick={addPart} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Part
            </Button>
          </div>

          {reportForm.parts_used.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Parts Added:</h4>
              {reportForm.parts_used.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="text-sm">
                    <span className="font-medium">{part.name}</span>
                    <span className="text-muted-foreground ml-2">
                      Qty: {part.quantity}
                      {part.part_number && ` | PN: ${part.part_number}`}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePart(part.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photos Section */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handlePhotoCapture} variant="outline" className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Add Photo
          </Button>

          {reportForm.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {reportForm.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt="Report photo"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removePhoto(photo.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Input
                    placeholder="Add caption..."
                    value={photo.caption}
                    onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                    className="mt-2 text-xs"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional notes or observations..."
            value={reportForm.engineer_notes}
            onChange={(e) => setReportForm(prev => ({ ...prev, engineer_notes: e.target.value }))}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmitReport}
        disabled={loading || !reportForm.assignment_id || !reportForm.type}
        className="w-full"
        size="lg"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </Button>
    </div>
  );

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveTab('reports')}
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Reports
        </Button>
        <Button
          variant={activeTab === 'new-report' ? 'default' : 'outline'}
          onClick={() => setActiveTab('new-report')}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'reports' ? renderReportsList() : renderNewReportForm()}
    </div>
  );
};

export default MobileFieldService;