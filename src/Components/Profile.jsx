import { useState, useEffect } from "react";
import { getUserUploads, getPins, deletePin, getFollowersCount, getFollowingStatus, toggleFollow } from "../api/api";
import "./../styles/Profile.css";
import Top from "./Top";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const normalizeImagePath = (imagePath) => {
    if (!imagePath) return null;

    // Remove any leading 'uploads/' or 'uploads\'
    const cleanPath = imagePath.replace(/^(uploads[/\\])?/, '');

    // Construct full URL
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      
      // Get userId from URL if this is viewing another user's profile
      // This assumes you have a route like /profile?id=123
      const urlParams = new URLSearchParams(window.location.search);
      const profileUserId = urlParams.get('id') || userId;
      const isOwnProfile = profileUserId === userId;

      console.log("User data:", { profileUserId, isOwnProfile });

      if (!userId || !username) {
        throw new Error("User data not found. Please login again.");
      }

      // Get user details (you might need to add an API endpoint to fetch user by ID)
      // For now, using localStorage for own profile
      if (isOwnProfile) {
        setUser({ username, userId: profileUserId });
      } else {
        // You might need to fetch other user's details from backend
        // For now just setting the ID until you have the API endpoint
        setUser({ userId: profileUserId });
      }

      // Fetch followers count
      try {
        console.log(`Requesting followers count for user ID: ${profileUserId}`);
        const followersResponse = await getFollowersCount(profileUserId);
        console.log("Followers count response:", followersResponse.data);
        setFollowersCount(followersResponse.data.followers);
      } catch (followersError) {
        console.error("Error fetching followers count:", followersError);
      }

      // Fetch follow status (only if viewing someone else's profile)
      if (!isOwnProfile) {
        try {
          const followStatusResponse = await getFollowingStatus(profileUserId);
          console.log("Follow status response:", followStatusResponse.data);
          setIsFollowing(followStatusResponse.data.isFollowing);
        } catch (followStatusError) {
          console.error("Error fetching following status:", followStatusError);
        }
      }

      // Fetch only this profile's uploads
      const uploadsResponse = await getUserUploads(profileUserId);
      console.log("User uploads:", uploadsResponse.data);
      setUploads(uploadsResponse.data);

      // Fetch profile's pins
      try {
        const pinsResponse = await getPins();
        console.log("All pins response:", pinsResponse.data);

        // Make sure we're properly filtering pins for this profile
        // using the correct userId capitalization and converting to strings for comparison
        const userPins = pinsResponse.data.filter(pin => {
          // Use the capital "I" for userId to match the database
          const pinUserId = pin.userId || pin.userid; // Try both capitalizations
          const pinUserIdStr = String(pinUserId);
          const profileUserIdStr = String(profileUserId);

          console.log(`Comparing pin userId ${pinUserIdStr} with profile ${profileUserIdStr}:`,
            pinUserIdStr === profileUserIdStr);

          // Also check Upload exists before trying to access it
          const hasUpload = pin.Upload || pin.upload; // Try both capitalizations

          return pinUserIdStr === profileUserIdStr && hasUpload;
        });

        console.log("Filtered user pins:", userPins);
        setPins(userPins);
      } catch (pinError) {
        console.error("Error fetching pins:", pinError);
        if (pinError.response?.status === 401) {
          setError("Authentication error. Please login again.");
        } else {
          setError("Failed to load pins. " + pinError.message);
        }
      }

    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Listen for pin updates from other components
    const handlePinUpdate = () => {
      if (localStorage.getItem('pinsUpdated') === 'true') {
        console.log('Detected pin updates, refreshing pins');
        localStorage.removeItem('pinsUpdated');
        fetchUserData();
      }
    };

    window.addEventListener('storage', handlePinUpdate);
    window.addEventListener('pinUpdated', handlePinUpdate);

    return () => {
      window.removeEventListener('storage', handlePinUpdate);
      window.removeEventListener('pinUpdated', handlePinUpdate);
    };
  }, []);

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle unpinning from profile
  const handleUnpin = async (pinId) => {
    if (!window.confirm("Remove this pin?")) {
      return;
    }

    try {
      await deletePin(pinId);

      // Update local state
      setPins(prev => prev.filter(p => p.id !== pinId));

      // Notify other components
      localStorage.setItem('pinsUpdated', 'true');
      window.dispatchEvent(new Event('storage'));

      alert("Pin removed successfully");
    } catch (error) {
      console.error("Error removing pin:", error);

      // If pin isn't found, still update UI
      if (error.response?.status === 404) {
        setPins(prev => prev.filter(p => p.id !== pinId));
        alert("Pin already removed");
      } else {
        alert(error.response?.data?.message || "Failed to remove pin");
      }
    }
  };
  
  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!user || !user.userId) return;
    
    setFollowLoading(true);
    
    try {
      console.log(`Toggling follow for user ID: ${user.userId}`);
      const response = await toggleFollow(user.userId);
      console.log("Follow toggle response:", response.data);
      
      // Update UI based on new follow status
      setIsFollowing(response.data.isFollowing);
      
      // Update followers count
      if (response.data.isFollowing) {
        setFollowersCount(prev => prev + 1);
      } else {
        setFollowersCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(error.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };
  
  // Check if this is the user's own profile
  const isOwnProfile = () => {
    const loggedInUserId = localStorage.getItem("userId");
    return user && user.userId === loggedInUserId;
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
            <p className="followers-count">{followersCount} {followersCount === 1 ? "follower" : "followers"}</p>
            
            {/* Only show follow button if this is not the user's own profile */}
            {user && !isOwnProfile() && (
              <button 
                className={`follow-button ${isFollowing ? 'following' : ''}`} 
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {followLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </>
        )}
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
                        e.target.src = "/placeholder-image.jpg"; // Fallback image
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
                pins.map((pin) => {
                  // Get the Upload, accounting for different capitalizations
                  const upload = pin.Upload || pin.upload;

                  return (
                    <div key={pin.id} className="pin-item">
                      {upload && (
                        <>
                          <img
                            src={normalizeImagePath(upload.imagePath)}
                            alt={upload.description || 'Pinned image'}
                            onError={(e) => {
                              console.error("Pin Image failed:", e.target.src);
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                          <div className="pin-details">
                            {upload.description && <p>{upload.description}</p>}
                            <button
                              className="unpin-button"
                              onClick={() => handleUnpin(pin.id)}
                            >
                              Unpin
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
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