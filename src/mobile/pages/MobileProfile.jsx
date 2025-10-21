import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Settings,
  Bell,
  Smartphone,
  LogOut,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Award,
  Clock,
  Briefcase
} from 'lucide-react';
import { engineerProfile } from '@/services/mobileApi';
import {
  vibrate,
  getBatteryInfo,
  isPWA,
  installPWA,
  pickPhoto
} from '@/utils/pwaUtils';

const MobileProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    employee_id: '',
    department: '',
    specializations: [],
    certifications: [],
    experience_years: 0,
    total_assignments: 0,
    completed_assignments: 0,
    rating: 0,
    avatar: null
  });

  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    location_sharing: true,
    auto_sync: true,
    offline_mode: false,
    dark_mode: false
  });
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchDeviceInfo();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await engineerProfile.getProfile();
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceInfo = async () => {
    try {
      const battery = await getBatteryInfo();
      setDeviceInfo({
        isPWA: isPWA(),
        battery,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      });
    } catch (error) {
      console.log('Error fetching device info:', error);
    }
  };

  const handlePhotoUpload = async () => {
    try {
      vibrate(50);
      setUploadingPhoto(true);

      const photo = await pickPhoto();

      if (photo) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(photo);

        // Update profile with new photo
        const updatedProfile = { ...profile, avatar: previewUrl };
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);

        // In a real app, you would upload to server here
        // For demo, we'll just store locally
        localStorage.setItem('engineer_avatar', previewUrl);

        alert('Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditToggle = () => {
    vibrate(50);
    if (editMode) {
      setEditedProfile(profile);
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      vibrate(100);

      await engineerProfile.updateProfile(editedProfile);
      setProfile(editedProfile);
      setEditMode(false);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    vibrate(30);
    setSettings(prev => ({ ...prev, [key]: value }));

    // Handle specific settings
    switch (key) {
      case 'dark_mode':
        document.documentElement.classList.toggle('dark', value);
        break;
      case 'notifications_enabled':
        if (!value) {
          // Disable notifications
        } else {
          // Re-enable notifications
        }
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      vibrate(100);
      // Clear stored tokens and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const handleInstallPWA = async () => {
    try {
      vibrate(50);
      await installPWA();
    } catch (error) {
      console.log('PWA installation not available or dismissed');
    }
  };

  const getCompletionRate = () => {
    if (profile.total_assignments === 0) return 0;
    return Math.round((profile.completed_assignments / profile.total_assignments) * 100);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Profile Header */}
      <Card className="rounded-md bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 border-blue-500 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-primary-foreground/20">
                <AvatarImage src={profile.avatar || "/avatar-placeholder.png"} />
                <AvatarFallback className="text-primary text-xl">
                  {profile.name?.split(' ').map(n => n[0]).join('') || 'EN'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex-1">
              <h2 className="text-xl text-white font-semibold">{profile.name}</h2>
              <p className="text-primary-foreground/80">{profile.department}</p>
              <p className="text-sm text-primary-foreground/70">
                ID: {profile.employee_id}
              </p>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{profile.total_assignments}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card className="rounded-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getCompletionRate()}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl space-x-2">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email || 'Not provided'}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone || 'Not provided'}</span>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.address || 'Not provided'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl space-x-2">
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4" />
              <div>
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => handleSettingChange('notifications_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4" />
              <div>
                <Label>Location Sharing</Label>
                <p className="text-sm text-muted-foreground">Share location for assignments</p>
              </div>
            </div>
            <Switch
              checked={settings.location_sharing}
              onCheckedChange={(checked) => handleSettingChange('location_sharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4" />
              <div>
                <Label>Auto Sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync data</p>
              </div>
            </div>
            <Switch
              checked={settings.auto_sync}
              onCheckedChange={(checked) => handleSettingChange('auto_sync', checked)}
            />
          </div>
          <Button
            onClick={handleLogout}
            size="lg"
            className="w-full mt-6 flex items-center justify-center gap-2 text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileProfile;