import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Wifi,
  WifiOff,
  Shield,
  AlertCircle
} from 'lucide-react';
import { engineerAuth } from '@/services/mobileApi';
import { 
  isPWA, 
  installPWA, 
  isOnline,
  vibrate,
  requestNotificationPermission 
} from '@/utils/pwaUtils';

const MobileLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({
    isPWA: isPWA(),
    isOnline: isOnline()
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('engineer_token');
    if (token) {
      navigate('/mobile/dashboard');
    }

    // Update device info
    setDeviceInfo({
      isPWA: isPWA(),
      isOnline: isOnline()
    });
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      vibrate(200);
      return;
    }

    try {
      setLoading(true);
      setError('');
      vibrate(50);

      const response = await engineerAuth.login(credentials);
      
      // Store authentication data
      localStorage.setItem('engineer_token', response.token);
      localStorage.setItem('engineer_user', JSON.stringify(response.user));
      
      // Request notification permission
      try {
        await requestNotificationPermission();
      } catch (notifError) {
        console.log('Notification permission denied');
      }

      // Navigate to dashboard
      navigate('/mobile/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      vibrate([100, 50, 100]);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Service Portal</h1>
            <p className="text-white/80 text-lg">Engineer Mobile App</p>
          </div>
          
          {/* Device Status */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm">
              {deviceInfo.isOnline ? (
                <Wifi className="h-4 w-4 text-green-300" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-300" />
              )}
              <span className={deviceInfo.isOnline ? 'text-green-300' : 'text-red-300'}>
                {deviceInfo.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {deviceInfo.isPWA && (
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm">
                <Shield className="h-4 w-4 text-blue-300" />
                <span className="text-blue-300">PWA</span>
              </div>
            )}
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="engineer@company.com"
                    value={credentials.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-12 pr-12 h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white transition-colors"
                size="lg"
                disabled={loading || !deviceInfo.isOnline}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              {/* Demo credentials */}
              <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
                <p className="mb-2 font-medium">Demo Credentials:</p>
                <p><strong>Email:</strong> engineer@company.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </form>

            {!deviceInfo.isOnline && (
              <div className="mt-6 p-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <WifiOff className="h-4 w-4" />
                  <span>You're offline</span>
                </div>
                <p>Please connect to the internet to sign in.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileLogin;