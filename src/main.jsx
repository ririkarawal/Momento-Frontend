import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './Components/Header'; // Import Header
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import Register from './Components/Register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header /> 
      <Routes>
      <Route path="/" element={<LandingPage />} /> 
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>
);
