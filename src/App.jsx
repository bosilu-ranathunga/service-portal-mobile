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

  if (!isPWA) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h2>🔒 Access Restricted</h2>
        <p>This app is available only as a PWA. Please install it to continue.</p>
        <p>Tap <strong>“Add to Home Screen”</strong> or use the button below.</p>

        {canInstall && (
          <button
            onClick={handleInstallClick}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "16px",
              fontSize: "16px",
            }}
          >
            📲 Install App
          </button>
        )}
      </div>
    );
  }

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
