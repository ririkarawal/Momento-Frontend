import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUpload, FaBell, FaCog, FaBars } from "react-icons/fa";
import Upload from "./Upload"; // Import Upload component
import "./../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUpload, setShowUpload] = useState(false); // State for Upload Form

  useEffect(() => {
    setIsExpanded(location.pathname === "/");
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSidebarItemClick = (label) => {
    console.log(`Sidebar item clicked: ${label}`);
    switch (label) {
      case "Home":
        navigate("/dashboard");
        break;
      case "Upload":
        setShowUpload(true);
        break;
      case "Reminder":
        alert("Reminder feature coming soon!");
        break;
      case "Setting":
        navigate("/profile");
        break;
      default:
        break;
    }
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
            <SidebarItem
              icon={<FaHome />}
              label="Home"
              isExpanded={isExpanded}
              onClick={() => handleSidebarItemClick("Home")}
            />
            <SidebarItem
              icon={<FaUpload />}
              label="Upload"
              isExpanded={isExpanded}
              onClick={() => handleSidebarItemClick("Upload")}
            />
            <SidebarItem
              icon={<FaBell />}
              label="Reminder"
              isExpanded={isExpanded}
              onClick={() => handleSidebarItemClick("Reminder")}
            />
            <SidebarItem
              icon={<FaCog />}
              label="Setting"
              isExpanded={isExpanded}
              onClick={() => handleSidebarItemClick("Setting")}
            />
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
    <div className="sidebar-item" onClick={() => { 
      console.log(`Clicked on ${label}`);
      onClick();
    }}>
      <div className="icon">{icon}</div>
      {isExpanded && <span className="label">{label}</span>}
    </div>
  );
};

export default Sidebar;
