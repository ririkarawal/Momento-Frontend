import { useState, useEffect } from "react";
import "./../styles/Profile.css";
import Top from "./Top";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState([]);  // State to store uploads
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    console.log("Profile page loaded");
    const username = localStorage.getItem("username");

    if (username) {
      setUser({ username });
      fetchUploads(username);  // Fetch uploads after setting username
    } else {
      setError("Failed to load user data");
    }
  }, []);

  // Fetch user uploads from the backend API
  const fetchUploads = async (username) => {
    try {
      // Replace this with your API endpoint that fetches uploads by username or user ID
      const response = await fetch(`http://localhost:5000/uploads/view_uploads?username=${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch uploads");
      }
      const data = await response.json();
      setUploads(data);  // Store the uploaded images in state
      setLoading(false);
    } catch (error) {
      setError("Error fetching uploads");
      setLoading(false);
    }
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
        <span className="tab active">Created</span>
        <span className="tab">Saved</span>
      </div>

      {/* Created Section - Display uploaded images */}
      <div className="created-section">
        {loading ? (
          <p>Loading your uploads...</p>
        ) : (
          <div className="uploads-gallery">
            {uploads.length > 0 ? (
              uploads.map((upload) => (
                <div key={upload.id} className="upload-item">
                  <img src={`http://localhost:5000/${upload.imagePath}`} alt={upload.description} />
                  <p>{upload.description}</p>
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
