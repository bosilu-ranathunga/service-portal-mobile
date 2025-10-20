// Dummy data service for testing mobile PWA functionality

// Engineer profile dummy data
export const dummyEngineerProfile = {
  id: 'ENG001',
  name: 'John Smith',
  email: 'john.smith@company.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, Tech City, TC 12345',
  employee_id: 'ENG001',
  department: 'Field Service Engineering',
  specializations: ['HVAC Systems', 'Electrical Equipment', 'Preventive Maintenance', 'Emergency Repairs'],
  certifications: ['EPA Section 608', 'OSHA 30-Hour', 'Electrical Safety', 'Confined Space'],
  experience_years: 8,
  total_assignments: 847,
  completed_assignments: 823,
  rating: 4.8,
  avatar: localStorage.getItem('engineer_avatar') || null
};

// Dashboard statistics dummy data
export const dummyDashboardStats = {
  todayAssignments: 6,
  completedToday: 3,
  pendingReports: 2,
  totalDistance: 127,
  completionRate: 97,
  avgResponseTime: 24, // minutes
  customerSatisfaction: 4.9
};

// Today's schedule dummy data
export const dummyTodaySchedule = [
  {
    id: 'ASG001',
    customer_name: 'Tech Solutions Inc',
    customer_company: 'Tech Solutions Inc',
    customer_phone: '+1 (555) 987-6543',
    customer_email: 'maintenance@techsolutions.com',
    type: 'Preventive Maintenance',
    status: 'completed',
    priority: 'medium',
    location: '456 Business Park Dr, Tech City, TC 12346',
    description: 'Quarterly HVAC system inspection and filter replacement',
    scheduled_date: '2025-10-02',
    scheduled_time: '2025-10-02T08:00:00Z',
    estimated_end_time: '2025-10-02T10:00:00Z',
    estimated_duration: 2,
    completed_at: '2025-10-02T09:45:00Z',
    equipment_details: 'Carrier 30GTN080 Rooftop Unit',
    special_instructions:
      'Building access requires security badge. Contact front desk upon arrival.',
  },
  {
    id: 'ASG002',
    customer_name: 'Metro Hospital',
    customer_company: 'Metro Healthcare System',
    customer_phone: '+1 (555) 234-5678',
    customer_email: 'facilities@metrohospital.com',
    type: 'Emergency Repair',
    status: 'in_progress',
    priority: 'high',
    location: '789 Healthcare Blvd, Medical District, TC 12347',
    description: 'Critical cooling system failure in server room',
    scheduled_date: '2025-10-02',
    scheduled_time: '2025-10-02T11:30:00Z',
    estimated_end_time: '2025-10-02T14:30:00Z',
    estimated_duration: 3,
    started_at: '2025-10-02T11:15:00Z',
    equipment_details: 'Liebert XDC-2 Precision Cooling Unit',
    special_instructions:
      'URGENT: Hospital server room. Coordinate with IT department. Backup cooling in place.',
  },
  {
    id: 'ASG003',
    customer_name: 'Green Valley School',
    customer_company: 'Green Valley School District',
    customer_phone: '+1 (555) 345-6789',
    customer_email: 'maintenance@greenvalley.edu',
    type: 'Installation',
    status: 'accepted',
    priority: 'medium',
    location: '321 Education Way, Suburban Area, TC 12348',
    description: 'Install new energy-efficient lighting system in gymnasium',
    scheduled_date: '2025-10-02',
    scheduled_time: '2025-10-02T15:00:00Z',
    estimated_end_time: '2025-10-02T18:00:00Z',
    estimated_duration: 3,
    equipment_details: 'LED High Bay Lighting System - 24 Units',
    special_instructions:
      'School hours: Installation must be completed after 3 PM. Coordinate with facilities manager.',
  },
  {
    id: 'ASG004',
    customer_name: 'Riverside Manufacturing',
    customer_company: 'Riverside Industrial Corp',
    customer_phone: '+1 (555) 456-7890',
    customer_email: 'ops@riversidemanufacturing.com',
    type: 'Inspection',
    status: 'pending',
    priority: 'low',
    location: '654 Industrial Pkwy, Factory District, TC 12349',
    description: 'Annual safety inspection of compressed air systems',
    scheduled_date: '2025-10-02',
    scheduled_time: '2025-10-02T16:30:00Z',
    estimated_end_time: '2025-10-02T18:30:00Z',
    estimated_duration: 2,
    equipment_details: 'Atlas Copco GA55 Rotary Screw Compressor',
    special_instructions:
      'PPE required: Safety glasses, hard hat, steel-toed boots. Report to security gate first.',
  },
];

// Recent activity dummy data
export const dummyRecentActivity = [
  {
    id: 'ACT001',
    type: 'completed',
    description: 'Completed HVAC maintenance at Tech Solutions Inc',
    timestamp: '2025-10-02T09:45:00Z',
    assignment_id: 'ASG001'
  },
  {
    id: 'ACT002',
    type: 'in_progress',
    description: 'Started emergency repair at Metro Hospital',
    timestamp: '2025-10-02T11:15:00Z',
    assignment_id: 'ASG002'
  },
  {
    id: 'ACT003',
    type: 'accepted',
    description: 'Accepted installation job at Green Valley School',
    timestamp: '2025-10-02T10:30:00Z',
    assignment_id: 'ASG003'
  },
  {
    id: 'ACT004',
    type: 'report_created',
    description: 'Created field report for Alpha Corp maintenance',
    timestamp: '2025-10-01T16:20:00Z',
    assignment_id: 'ASG999'
  },
  {
    id: 'ACT005',
    type: 'notification',
    description: 'Received new urgent assignment notification',
    timestamp: '2025-10-02T08:15:00Z',
    assignment_id: 'ASG002'
  }
];

// Extended assignments list for testing
export const dummyAssignments = [
  ...dummyTodaySchedule,
  {
    id: 'ASG005',
    customer_name: 'Downtown Office Complex',
    customer_company: 'Skyline Properties',
    customer_phone: '+1 (555) 567-8901',
    customer_email: 'maintenance@skylineproperties.com',
    type: 'Preventive Maintenance',
    status: 'pending',
    priority: 'medium',
    location: '100 Skyline Plaza, Downtown, TC 12350',
    description: 'Monthly elevator maintenance and inspection',
    scheduled_date: '2025-10-03',
    scheduled_time: '2025-10-03T09:00:00Z',
    estimated_end_time: '2025-10-03T12:00:00Z',
    estimated_duration: 3,
    equipment_details: 'Otis Gen2 Elevator System - 8 Cars',
    special_instructions: 'Coordinate with building management. Some elevators may need to be taken out of service.'
  },
  {
    id: 'ASG006',
    customer_name: 'City Water Treatment Plant',
    customer_company: 'Metro Water Authority',
    customer_phone: '+1 (555) 678-9012',
    customer_email: 'operations@metrowater.gov',
    type: 'Emergency Repair',
    status: 'pending',
    priority: 'high',
    location: '200 Water Works Dr, Industrial Zone, TC 12351',
    description: 'Pump motor failure - backup systems engaged',
    scheduled_date: '2025-10-03',
    scheduled_time: '2025-10-03T06:00:00Z',
    estimated_end_time: '2025-10-03T10:00:00Z',
    estimated_duration: 4,
    equipment_details: 'Grundfos CR64-2 Centrifugal Pump',
    special_instructions: 'CRITICAL INFRASTRUCTURE: 24/7 access. Security clearance required.'
  }
];

// Notifications dummy data
export const dummyNotifications = [
  {
    id: 'NOT001',
    title: 'New Urgent Assignment',
    message: 'Emergency repair required at Metro Hospital - Server room cooling failure',
    type: 'assignment',
    priority: 'high',
    read: false,
    created_at: '2025-10-02T08:15:00Z',
    data: {
      assignment_id: 'ASG002',
      location: 'Metro Hospital',
      customer_name: 'Metro Hospital'
    }
  },
  {
    id: 'NOT002',
    title: 'Assignment Update',
    message: 'Installation at Green Valley School has been rescheduled to 3:00 PM',
    type: 'assignment',
    priority: 'medium',
    read: false,
    created_at: '2025-10-02T07:30:00Z',
    data: {
      assignment_id: 'ASG003',
      location: 'Green Valley School'
    }
  },
  {
    id: 'NOT003',
    title: 'Report Reminder',
    message: 'Field report for Alpha Corp maintenance is pending completion',
    type: 'report',
    priority: 'medium',
    read: true,
    created_at: '2025-10-01T18:00:00Z',
    data: {
      assignment_id: 'ASG999'
    }
  },
  {
    id: 'NOT004',
    title: 'New Assignment Available',
    message: 'Preventive maintenance at Downtown Office Complex - Available for acceptance',
    type: 'assignment',
    priority: 'low',
    read: true,
    created_at: '2025-10-01T16:45:00Z',
    data: {
      assignment_id: 'ASG005',
      location: 'Downtown Office Complex'
    }
  },
  {
    id: 'NOT005',
    title: 'Schedule Reminder',
    message: 'Tomorrow: 3 assignments scheduled starting at 9:00 AM',
    type: 'reminder',
    priority: 'low',
    read: true,
    created_at: '2025-10-01T20:00:00Z',
    data: {}
  }
];

// Field reports dummy data
export const dummyFieldReports = [
  {
    id: 'RPT001',
    assignment_id: 'ASG001',
    customer_name: 'Tech Solutions Inc',
    type: 'maintenance',
    description: 'Quarterly HVAC system maintenance completed successfully',
    findings: 'All systems operating within normal parameters. Filters were due for replacement.',
    recommendations: 'Continue quarterly maintenance schedule. Consider upgrading to higher efficiency filters.',
    work_performed: 'Replaced air filters, cleaned coils, checked refrigerant levels, calibrated thermostats',
    parts_used: [
      { id: 1, name: 'HVAC Air Filter 20x25x1', quantity: '6', part_number: 'AF-20251-MERV13' },
      { id: 2, name: 'Coil Cleaner', quantity: '2', part_number: 'CC-FOAM-32OZ' }
    ],
    hours_spent: '2.5',
    engineer_notes: 'Customer satisfied with service. Scheduled next maintenance for January 2026.',
    photos: [
      {
        id: 1,
        url: '/api/placeholder/400/300',
        caption: 'Before: Old filters showing significant dust accumulation'
      },
      {
        id: 2,
        url: '/api/placeholder/400/300',
        caption: 'After: New high-efficiency filters installed'
      },
      {
        id: 3,
        url: '/api/placeholder/400/300',
        caption: 'Thermostat calibration readings'
      }
    ],
    status: 'completed',
    created_at: '2025-10-02T10:30:00Z',
    customer_signature: 'Mike Johnson - Facilities Manager'
  },
  {
    id: 'RPT002',
    assignment_id: 'ASG999',
    customer_name: 'Alpha Manufacturing Corp',
    type: 'repair',
    description: 'Emergency repair of conveyor belt motor',
    findings: 'Motor bearings were severely worn causing excessive vibration and noise',
    recommendations: 'Implement preventive maintenance schedule for all conveyor motors',
    work_performed: 'Replaced motor bearings, realigned motor shaft, tested operation under load',
    parts_used: [
      { id: 1, name: 'Motor Bearing 6308ZZ', quantity: '2', part_number: 'BRG-6308ZZ' },
      { id: 2, name: 'Bearing Grease', quantity: '1', part_number: 'GRS-NLGI2-400G' }
    ],
    hours_spent: '4.0',
    engineer_notes: 'Production line restored to full operation. Training provided to maintenance staff.',
    photos: [
      {
        id: 1,
        url: '/api/placeholder/400/300',
        caption: 'Worn bearing removed from motor'
      },
      {
        id: 2,
        url: '/api/placeholder/400/300',
        caption: 'New bearings installed and greased'
      }
    ],
    status: 'completed',
    created_at: '2025-10-01T16:20:00Z',
    customer_signature: 'Sarah Wilson - Production Manager'
  }
];

// Mock API functions that return dummy data
export const mockAPI = {
  // Authentication
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    if (credentials.email === 'engineer@company.com' && credentials.password === 'password123') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: dummyEngineerProfile
      };
    }
    throw new Error('Invalid credentials');
  },

  // Engineer Profile
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyEngineerProfile;
  },

  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const updatedProfile = { ...dummyEngineerProfile, ...profileData };

    // Store avatar in localStorage if provided
    if (profileData.avatar) {
      localStorage.setItem('engineer_avatar', profileData.avatar);
    }

    return updatedProfile;
  },

  // Dashboard
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return dummyDashboardStats;
  },

  getTodaySchedule: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyTodaySchedule;
  },

  getRecentActivity: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return dummyRecentActivity;
  },

  // Assignments
  getAssignments: async (status = 'all') => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (status === 'all') return dummyAssignments;
    return dummyAssignments.filter(assignment => assignment.status === status);
  },

  getAssignmentDetails: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyAssignments.find(assignment => assignment.id === id);
  },

  updateAssignmentStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return { success: true, message: `Assignment ${id} status updated to ${status}` };
  },

  acceptAssignment: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: `Assignment ${id} accepted` };
  },

  startWork: async (id, location) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: `Work started for assignment ${id}`, location };
  },

  completeWork: async (id, completionData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: `Assignment ${id} completed`, data: completionData };
  },

  // Field Service Reports
  getReports: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return dummyFieldReports;
  },

  createReport: async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newReport = {
      id: 'RPT' + String(Date.now()).slice(-3),
      ...reportData,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    return newReport;
  },

  uploadPhoto: async (reportId, photoFile) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: Date.now(),
      url: URL.createObjectURL(photoFile),
      filename: photoFile.name
    };
  },

  // Notifications
  getNotifications: async (page = 1, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: dummyNotifications.slice(start, end),
      hasMore: end < dummyNotifications.length,
      unreadCount: dummyNotifications.filter(n => !n.read).length
    };
  },

  markAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: `Notification ${notificationId} marked as read` };
  },

  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'All notifications marked as read' };
  },

  subscribeToNotifications: async (subscription) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true, message: 'Subscribed to push notifications' };
  }
};

export default mockAPI;