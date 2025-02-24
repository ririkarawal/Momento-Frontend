import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Profile from "./Components/Profile";
import CategoryPage from "./Components/CategoryPage";

const App = () => {
  const location = useLocation();
  
  const isCategoryPage = location.pathname.startsWith('/category/');
  
  const showSidebar = location.pathname === "/dashboard" || 
                      location.pathname === "/profile" || 
                      isCategoryPage;
  
  const hideHeader = location.pathname === "/dashboard" || 
                     location.pathname === "/profile" || 
                     isCategoryPage;
  
  return (
    <div className="app-container">
      {/* Sidebar should be properly wrapped */}
      {showSidebar && (
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
      )}
      
      {/* Show Header for all pages except Dashboard, Profile, and Category */}
      {!hideHeader && <Header />}
      
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);