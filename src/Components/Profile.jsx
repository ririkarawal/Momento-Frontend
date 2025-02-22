import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/api"; // Ensure this path is correct
 // Import the new function
import "./../styles/Profile.css";
import Top from "./Top";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        setUser(response.data); // Assuming response.data contains { username, followingCount }
      })
      .catch((error) => {
        setError("Failed to load user data"); // ✅ Display error message
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };


  return (
    <div className="profile-container">
      <div className="profile-header">
        <label htmlFor="profile-upload" className="profile-pic">
          <img
            src={profileImage || "https://via.placeholder.com/150"} // ✅ Default image
            alt="Profile"
          />
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
        
        {error ? ( // ✅ Show error if API call fails
          <p className="error-message">{error}</p>
        ) : (
          <>
            <h2 className="username">{user ? user.username : "Loading..."}</h2>
            <p className="following">{user ? `${user.followingCount} following` : "Loading..."}</p>
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
