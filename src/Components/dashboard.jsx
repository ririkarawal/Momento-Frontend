import { useState } from "react";
import "./../styles/Dashboard.css";

export default function Dashboard() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [images, setImages] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Momento</h2>
        <nav className="nav-links">
          <a href="#">🏠 Home</a>
          <label htmlFor="upload-input" className="upload-btn">📤 Upload Moments</label>
          <input
            type="file"
            id="upload-input"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <a href="#">🔔 Notification</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <span>🔍</span>
          </div>

          {/* Icons Section */}
          <div className="icons">
            {/* Filter Icon */}
            <div className="icon" onClick={() => setFilterDropdown(!filterDropdown)}>
              ⚙️
              {filterDropdown && (
                <div className="dropdown">
                  <a href="#">Filter 1</a>
                  <a href="#">Filter 2</a>
                  <a href="#">Filter 3</a>
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <div className="icon" onClick={() => setProfileDropdown(!profileDropdown)}>
              👤
              {profileDropdown && (
                <div className="dropdown">
                  <a href="#">Profile</a>
                  <a href="#">Settings</a>
                  <a href="#">Logout</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid">
          {images.length > 0 ? (
            images.map((src, index) => (
              <div className="box" key={index}>
                <img src={src} alt={`Uploaded ${index}`} />
                <p>User {index + 1}</p>
              </div>
            ))
          ) : (
            <p className="no-images">No images uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
