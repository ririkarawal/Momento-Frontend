import { useState, useEffect } from "react";
import { getUploads } from "../api/api";
import "./../styles/Dashboard.css";
import Top from "./Top.jsx";

const Dashboard = () => {
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
      const fetchAllUploads = async () => {
          try {
              const response = await getUploads();
              console.log("All uploads response:", response.data);
              
              // Validate uploads with image paths
              const validUploads = response.data.filter(upload => 
                upload.imagePath && upload.imagePath.trim() !== ''
              );

              setUploads(validUploads);
              setLoading(false);
          } catch (error) {
              console.error("Error fetching uploads:", error);
              setLoading(false);
          }
      };

      fetchAllUploads();
  }, []);

  return (
      <div className="dashboard">
          <Top />
          <div className="grid">
              {loading ? (
                  <p>Loading...</p>
              ) : (
                  uploads.map((upload) => (
                      <div className="card" key={upload.id}>
                          <div className="img-wrap">
                              <img 
                                  src={normalizeImagePath(upload.imagePath)} 
                                  alt={upload.description || 'Uploaded image'} 
                                  className="img-box"
                                  onError={(e) => {
                                    console.error("Image failed to load:", e.target.src);
                                    e.target.style.display = 'none';
                                  }}
                              />
                          </div>
                          <div className="info">
                              <span className="username">
                                  Uploaded by: {upload.User?.username || "Unknown User"}
                              </span>
                              <button className="like">
                                  {upload.isLiked ? "❤️" : "🤍"}
                              </button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
  );
};

export default Dashboard;