import { useState, useEffect } from "react";
import { getUserUploads } from "../api/api";
import "./../styles/Profile.css";
import Top from "./Top";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const response = await getUserUploads(userId);
        console.log("User uploads:", response.data);
        setUploads(response.data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        <span className="tab active">Created</span>
        <span className="tab">Saved</span>
      </div>

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

      <Top />
    </div>
  );
};

export default Profile;