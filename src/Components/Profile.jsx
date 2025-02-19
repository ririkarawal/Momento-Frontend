import { useState } from "react";
import "./../styles/Profile.css";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const username = "Ri"; // Change dynamically based on user data
  const followingCount = 0; // Change dynamically based on following data

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
            src={profileImage || "https://via.placeholder.com/150"}
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
        <h2 className="username">{username}</h2>
        <p className="following">{followingCount} following</p>
        <button className="edit-profile">Edit Profile</button>
      </div>
      <div className="tabs">
        <span className="tab active">Created</span>
        <span className="tab">Saved</span>
      </div>
    </div>
  );
};

export default Profile;
