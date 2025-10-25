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
import FsrSubmitForm from './mobile/pages/FsrSubmitForm.jsx';
import PdfView from './mobile/pages/PdfView.jsx';
import FsrView from './mobile/pages/FsrView.jsx';

import Login from './Login';



function App() {
  const [count, setCount] = useState(0);
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


  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);




  useEffect(() => {
    // Detect if app is opened as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsPWA(isStandalone);

    // Capture install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Trigger install prompt
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA installed");
    }
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  {/* 
  if (!isPWA) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-sm shadow-sm p-8">

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Access Restricted
          </h2>

          <p className="text-gray-600 mb-2">
            This app is available only as a PWA. Please install it to continue.
          </p>

          <p className="text-gray-600 mb-6">
            Tap <strong className="text-gray-800">“Add to Home Screen”</strong> or use the button below.
          </p>

          {canInstall && (
            <button
              onClick={handleInstallClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-sm transition-all duration-200"
            >
              Install App
            </button>
          )}
        </div>
      </div>

    );
  }
  */}

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
        <Route path="fsr" element={<FsrSubmitForm />} />
        <Route path="fsr/:fsrId" element={<FsrView />} />
        <Route path="pdf-view" element={<PdfView />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
