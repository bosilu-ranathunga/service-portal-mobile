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
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
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
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-primary-foreground/80">{profile.department}</p>
              <p className="text-sm text-primary-foreground/70">
                ID: {profile.employee_id}
              </p>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">{getRatingStars(profile.rating)}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {profile.experience_years}+ years
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditToggle}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {editMode ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{profile.total_assignments}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{profile.completed_assignments}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getCompletionRate()}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode ? (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedProfile.name || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editedProfile.address || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Skills & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Skills & Certifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Specializations</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.specializations?.length > 0 ? (
                profile.specializations.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No specializations listed</span>
              )}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Certifications</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.certifications?.length > 0 ? (
                profile.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">{cert}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No certifications listed</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>App Settings</span>
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
        </CardContent>
      </Card>

      {/* Device Info */}
      {deviceInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Device Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Type:</span>
              <span>{deviceInfo.isPWA ? 'PWA' : 'Browser'}</span>
            </div>
            
            {deviceInfo.battery && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Battery:</span>
                <span>{deviceInfo.battery.level}% {deviceInfo.battery.charging ? '⚡' : ''}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform:</span>
              <span>{deviceInfo.platform}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language:</span>
              <span>{deviceInfo.language}</span>
            </div>
            
            {!deviceInfo.isPWA && (
              <Button
                onClick={handleInstallPWA}
                variant="outline"
                size="sm"
                className="w-full mt-3"
              >
                Install as App
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Card>
        <CardContent className="p-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileProfile;