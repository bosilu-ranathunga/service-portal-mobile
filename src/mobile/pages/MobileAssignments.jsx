import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';
import { assignments } from '@/services/mobileApi';
import { vibrate, getCurrentLocation } from '@/utils/pwaUtils';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

const MobileAssignments = () => {
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignmentsList, searchTerm, selectedStatus]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignments.getAssignments();
      setAssignmentsList(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    vibrate(50);
    await fetchAssignments();
    setRefreshing(false);
  };

  const filterAssignments = () => {
    let filtered = assignmentsList;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
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
      case 'in_progress':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          icon: PlayCircle,
          label: 'In Progress'
        };
      case 'completed':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: Clock,
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

  const getDateLabel = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const handleAssignmentAction = async (action, assignment) => {
    vibrate(100);

    try {
      switch (action) {
        case 'start':
          await assignments.startWork(assignment.id, await getCurrentLocation());
          break;
        case 'complete':
          await assignments.completeWork(assignment.id, {});
          break;
        case 'accept':
          await assignments.acceptAssignment(assignment.id);
          break;
        case 'view_details':
          window.location.href = `/mobile/assignments/${assignment.id}`;
          return;
        case 'call_customer':
          window.location.href = `tel:${assignment.customer_phone}`;
          return;
        case 'navigate':
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(assignment.location)}`;
          window.open(mapsUrl, '_blank');
          return;
        default:
          return;
      }

      // Refresh assignments after action
      await fetchAssignments();
    } catch (error) {
      console.error('Error performing assignment action:', error);
    }
  };

  const groupAssignmentsByDate = (assignments) => {
    const groups = {};
    assignments.forEach(assignment => {
      const dateKey = format(parseISO(assignment.scheduled_date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(assignment);
    });
    return groups;
  };

  const renderAssignmentCard = (assignment) => {
    const statusConfig = getStatusConfig(assignment.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card key={assignment.id} className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg">{assignment.customer_name}</h3>
                <Badge className={getPriorityColor(assignment.priority)}>
                  {assignment.priority}
                </Badge>
              </div>

              <div className="flex items-center space-x-1 mb-2">
                <StatusIcon className={`h-4 w-4 ${statusConfig.textColor}`} />
                <span className={`text-sm ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>
              </div>

              <Badge variant="outline" className="text-xs">
                {assignment.type}
              </Badge>
            </div>

            <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                {format(parseISO(assignment.scheduled_time), 'HH:mm')} -
                {format(parseISO(assignment.estimated_end_time || assignment.scheduled_time), 'HH:mm')}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{assignment.location}</span>
            </div>
          </div>

          {assignment.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {assignment.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            {assignment.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleAssignmentAction('accept', assignment)}
                  className="flex-1"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAssignmentAction('navigate', assignment)}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </>
            )}

            {assignment.status === 'accepted' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleAssignmentAction('start', assignment)}
                  className="flex-1"
                >
                  Start Work
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAssignmentAction('navigate', assignment)}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </>
            )}

            {assignment.status === 'in_progress' && (
              <Button
                size="sm"
                onClick={() => handleAssignmentAction('complete', assignment)}
                className="flex-1"
              >
                Complete
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAssignmentAction('view_details', assignment)}
            >
              Details
            </Button>

            {assignment.customer_phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAssignmentAction('call_customer', assignment)}
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const groupedAssignments = groupAssignmentsByDate(filteredAssignments);

  return (
    <div className="p-4 space-y-4 pb-20">

      {/* Assignments List */}
      <div className="space-y-4">
        {Object.keys(groupedAssignments).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assignments Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No assignments available at the moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedAssignments)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, assignments]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold mb-3 sticky top-16 bg-background py-2 z-10">
                  {getDateLabel(date)} ({assignments.length})
                </h2>
                {assignments.map(renderAssignmentCard)}
              </div>
            ))
        )}
      </div>

    </div>
  );
};

export default MobileAssignments;