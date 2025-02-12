import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './Components/Header'; // Import Header
import Login from './Components/Login';
import Register from './components/Register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header />  {/* Navbar always visible */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>
);
