import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Mobile components
import MobileLayout from './components/mobile/MobileLayout.jsx';
import MobileDashboard from './mobile/pages/MobileDashboard.jsx';
import MobileAssignments from './mobile/pages/MobileAssignments.jsx';
import MobileFieldService from './mobile/pages/MobileFieldService.jsx';
import MobileNotifications from './mobile/pages/MobileNotifications.jsx';
import MobileProfile from './mobile/pages/MobileProfile.jsx';
import JobInfo from './mobile/pages/JobInfo.jsx';




function App() {
  const [count, setCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Mobile Routes */}
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<MobileDashboard />} />
          <Route path="dashboard" element={<MobileDashboard />} />
          <Route path="assignments" element={<MobileAssignments />} />
          <Route path="field-service" element={<MobileFieldService />} />
          <Route path="field-service/new-report" element={<MobileFieldService />} />
          <Route path="notifications" element={<MobileNotifications />} />
          <Route path="profile" element={<MobileProfile />} />
        </Route>
        <Route path="job" element={<JobInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
