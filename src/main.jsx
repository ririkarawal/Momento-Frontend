import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/dashboard';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Profile from './Components/Profile'; // Import Profile component

const App = () => {
  const location = useLocation();

  return (
    <>
      {/* Hide Header on the Dashboard route */}
      {location.pathname !== '/dashboard' && <Header />}
      {location.pathname === '/dashboard' && <Sidebar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
