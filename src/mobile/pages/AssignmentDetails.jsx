import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Phone, 
  Navigation,
  Calendar,
  User,
  FileText,
  Camera,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  Wrench,
  Info
} from 'lucide-react';
import { assignments } from '@/services/mobileApi';
import { 
  vibrate, 
  getCurrentLocation,
  showNotification 
} from '@/utils/pwaUtils';
import { format, parseISO, differenceInMinutes } from 'date-fns';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [location, setLocation] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    fetchAssignmentDetails();
    getCurrentLocationData();
    
    // Update time elapsed every minute for active assignments
    const interval = setInterval(() => {
      if (assignment?.status === 'in_progress' && assignment?.started_at) {
        const elapsed = differenceInMinutes(new Date(), parseISO(assignment.started_at));
        setTimeElapsed(elapsed);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const data = await assignments.getAssignmentDetails(id);
      setAssignment(data);
      
      if (data.status === 'in_progress' && data.started_at) {
        const elapsed = differenceInMinutes(new Date(), parseISO(data.started_at));
        setTimeElapsed(elapsed);
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error);
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

  const handleStatusUpdate = async (newStatus, additionalData = {}) => {
    try {
      setUpdating(true);
      vibrate(100);

      const updateData = {
        status: newStatus,
        ...additionalData,
        location: location
      };

      switch (newStatus) {
        case 'accepted':
          await assignments.acceptAssignment(id);
          showNotification('Assignment Accepted', {
            body: `You have accepted the assignment for ${assignment.customer_name}`
          });
          break;
        case 'in_progress':
          await assignments.startWork(id, location);
          showNotification('Work Started', {
            body: `Work started for ${assignment.customer_name}`
          });
          break;
        case 'completed':
          await assignments.completeWork(id, updateData);
          showNotification('Work Completed', {
            body: `Assignment completed for ${assignment.customer_name}`
          });
          break;
        default:
          await assignments.updateAssignmentStatus(id, newStatus);
          break;
      }

      // Refresh assignment data
      await fetchAssignmentDetails();
      
    } catch (error) {
      console.error('Error updating assignment status:', error);
      alert('Error updating assignment. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          icon: AlertCircle,
          label: 'Pending'
        };
      case 'accepted':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          icon: CheckCircle,
          label: 'Accepted'
        };
      case 'in_progress':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          icon: PlayCircle,
          label: 'In Progress'
        };
      case 'completed':
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: CheckCircle,
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Assignment Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested assignment could not be found.
            </p>
            <Button onClick={() => navigate('/mobile/assignments')}>
              Back to Assignments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(assignment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mobile/assignments')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Assignment Details</h1>
      </div>

      {/* Status Header */}
      <Card className={statusConfig.bgColor}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className={`h-6 w-6 ${statusConfig.textColor}`} />
              <div>
                <h2 className={`font-semibold ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </h2>
                {assignment.status === 'in_progress' && timeElapsed > 0 && (
                  <p className={`text-sm ${statusConfig.textColor}`}>
                    Working for {formatDuration(timeElapsed)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={getPriorityColor(assignment.priority)}>
                {assignment.priority} Priority
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Customer Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/customer-avatar.png" />
              <AvatarFallback>
                {assignment.customer_name?.split(' ').map(n => n[0]).join('') || 'CU'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{assignment.customer_name}</h3>
              <p className="text-muted-foreground">{assignment.customer_company}</p>
            </div>
            {assignment.customer_phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `tel:${assignment.customer_phone}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{assignment.location}</span>
            </div>
            
            {assignment.customer_email && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm">{assignment.customer_email}</span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(assignment.location)}`;
              window.open(mapsUrl, '_blank');
            }}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </CardContent>
      </Card>

      {/* Assignment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Job Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Type</h4>
            <Badge variant="outline">{assignment.type}</Badge>
          </div>

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {assignment.description || 'No description provided'}
            </p>
          </div>

          {assignment.equipment_details && (
            <div>
              <h4 className="font-medium mb-2">Equipment</h4>
              <p className="text-sm text-muted-foreground">
                {assignment.equipment_details}
              </p>
            </div>
          )}

          {assignment.special_instructions && (
            <div>
              <h4 className="font-medium mb-2">Special Instructions</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {assignment.special_instructions}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Scheduled Date:</span>
            <span className="font-medium">
              {format(parseISO(assignment.scheduled_date), 'MMM dd, yyyy')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Time:</span>
            <span className="font-medium">
              {format(parseISO(assignment.scheduled_time), 'HH:mm')}
              {assignment.estimated_end_time && (
                <span> - {format(parseISO(assignment.estimated_end_time), 'HH:mm')}</span>
              )}
            </span>
          </div>

          {assignment.estimated_duration && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Duration:</span>
              <span className="font-medium">{assignment.estimated_duration} hours</span>
            </div>
          )}

          {assignment.started_at && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Started At:</span>
              <span className="font-medium">
                {format(parseISO(assignment.started_at), 'MMM dd, HH:mm')}
              </span>
            </div>
          )}

          {assignment.completed_at && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed At:</span>
              <span className="font-medium">
                {format(parseISO(assignment.completed_at), 'MMM dd, HH:mm')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {assignment.status === 'pending' && (
          <Button
            onClick={() => handleStatusUpdate('accepted')}
            disabled={updating}
            className="w-full"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {updating ? 'Accepting...' : 'Accept Assignment'}
          </Button>
        )}

        {assignment.status === 'accepted' && (
          <Button
            onClick={() => handleStatusUpdate('in_progress')}
            disabled={updating}
            className="w-full"
            size="lg"
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            {updating ? 'Starting...' : 'Start Work'}
          </Button>
        )}

        {assignment.status === 'in_progress' && (
          <>
            <Button
              onClick={() => handleStatusUpdate('completed')}
              disabled={updating}
              className="w-full"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {updating ? 'Completing...' : 'Complete Work'}
            </Button>
            
            <Button
              onClick={() => navigate(`/mobile/field-service/new-report?assignment=${assignment.id}`)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Create Report
            </Button>
          </>
        )}

        {assignment.status === 'completed' && (
          <Button
            onClick={() => navigate(`/mobile/field-service?assignment=${assignment.id}`)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <FileText className="h-5 w-5 mr-2" />
            View Reports
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;