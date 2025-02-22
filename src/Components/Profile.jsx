import { useState, useEffect } from "react";
import "./../styles/Profile.css";
import Top from "./Top";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Access username from localStorage and set it as the user data
    const username = localStorage.getItem("username");
    
    if (username) {
      setUser({ username }); // Setting the username fetched from localStorage
    } else {
      setError("Failed to load user data");
    }
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic">
          <i className="fas fa-user" style={{ fontSize: "100px", color: "#ccc" }}></i> {/* User Icon */}
        </div>

        {error ? ( // Show error if no username is found in localStorage
          <p className="error-message">{error}</p>
        ) : (
          <>
            <h2 className="username">{user ? user.username : "Loading..."}</h2>
            <p className="following">0 following</p> {/* You can later replace with actual following count */}
          </>
        )}

        <button className="edit-profile">Edit Profile</button>
      </div>
      <div className="tabs">
        <span className="tab active">Created</span>
        <span className="tab">Saved</span>
      </div>
      <Top />
    </div>
  );
};

export default Profile;
