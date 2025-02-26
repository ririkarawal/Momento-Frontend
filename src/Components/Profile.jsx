import { useState, useEffect } from "react";
import { getUserUploads, getPins } from "../api/api";
import "./../styles/Profile.css";
import Top from "./Top";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");

  const normalizeImagePath = (imagePath) => {
    if (!imagePath) return null;

    // Remove any leading 'uploads/' or 'uploads\'
    const cleanPath = imagePath.replace(/^(uploads[/\\])?/, '');

    // Construct full URL
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");

        if (!userId || !username) {
          throw new Error("User data not found");
        }

        setUser({ username, userId });

        // Fetch only this user's uploads
        const uploadsResponse = await getUserUploads(userId);
        console.log("User uploads:", uploadsResponse.data);
        setUploads(uploadsResponse.data);

        // Fetch user's pins
        try {
          const pinsResponse = await getPins();
          console.log("All pins:", pinsResponse.data);

          // Filter pins for the current user
          const userPins = pinsResponse.data.filter(pin =>
            pin.userId === parseInt(userId) && pin.Upload
          );

          console.log("Filtered user pins:", userPins);
          setPins(userPins);
        } catch (pinError) {
          console.error("Error fetching pins:", pinError);
        }

      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic">
          <i className="fas fa-user" style={{ fontSize: "100px", color: "#ccc" }}></i>
        </div>

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <h2 className="username">{user ? user.username : "Loading..."}</h2>
            <p className="following">0 following</p>
          </>
        )}

        <button className="edit-profile">Edit Profile</button>
      </div>

      <div className="tabs">
        <span
          className={`tab ${activeTab === "created" ? "active" : ""}`}
          onClick={() => handleTabClick("created")}
        >
          Created
        </span>
        <span
          className={`tab ${activeTab === "pins" ? "active" : ""}`}
          onClick={() => handleTabClick("pins")}
        >
          Pins
        </span>
      </div>

      {/* Created Section */}
      {activeTab === "created" && (
        <div className="created-section">
          {loading ? (
            <p>Loading your uploads...</p>
          ) : (
            <div className="uploads-gallery">
              {uploads.length > 0 ? (
                uploads.map((upload) => (
                  <div key={upload.id} className="upload-item">
                    <img
                      src={normalizeImagePath(upload.imagePath)}
                      alt={upload.description || 'Uploaded image'}
                      onError={(e) => {
                        console.error("Profile Image failed:", e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                    {upload.description && <p>{upload.description}</p>}
                  </div>
                ))
              ) : (
                <p>No uploads yet!</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pins Section */}
      {activeTab === "pins" && (
        <div className="pins-section">
          {loading ? (
            <p>Loading your pins...</p>
          ) : (
            <div className="pins-gallery">
              {pins.length > 0 ? (
                pins.map((pin) => (
                  <div key={pin.id} className="pin-item">
                    {pin.Upload && (
                      <>
                        <img
                          src={normalizeImagePath(pin.Upload.imagePath)}
                          alt={pin.Upload.description || 'Pinned image'}
                          onError={(e) => {
                            console.error("Pin Image failed:", e.target.src);
                            e.target.style.display = 'none';
                          }}
                        />
                        {pin.Upload.description && <p>{pin.Upload.description}</p>}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No pins yet! Pin images from the dashboard to see them here.</p>
              )}
            </div>
          )}
        </div>
      )}

      <Top />
    </div>
  );
};

export default Profile;