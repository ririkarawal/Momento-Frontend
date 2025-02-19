import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaHome, FaUpload, FaBell, FaCog, FaBars } from "react-icons/fa";
import Upload from "./Upload"; // Import Upload component
import "./../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUpload, setShowUpload] = useState(false); // State for Upload Form

  useEffect(() => {
    setIsExpanded(location.pathname === "/");
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="sidebar-container">
        <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
          <div className="toggle-container">
            <button className="toggle-btn" onClick={toggleSidebar}>
              <FaBars className="icon" />
            </button>
          </div>
          <nav className="nav">
            <SidebarItem icon={<FaHome />} label="Home" isExpanded={isExpanded} />
            <SidebarItem
              icon={<FaUpload />}
              label="Upload"
              isExpanded={isExpanded}
              onClick={() => setShowUpload(true)} // Open Upload Form
            />
            <SidebarItem icon={<FaBell />} label="Reminder" isExpanded={isExpanded} />
            <SidebarItem icon={<FaCog />} label="Setting" isExpanded={isExpanded} />
          </nav>
        </div>
      </div>

      {/* Show Upload Form if state is true */}
      {showUpload && <Upload onClose={() => setShowUpload(false)} />}
    </>
  );
};

const SidebarItem = ({ icon, label, isExpanded, onClick }) => {
  return (
    <div className="sidebar-item" onClick={onClick}>
      <div className="icon">{icon}</div>
      {isExpanded && <span className="label">{label}</span>}
    </div>
  );
};

export default Sidebar;
