import { useState, useEffect } from "react";
import { getUploads, getComments, createComment } from "../api/api";
import "./../styles/Dashboard.css";
import Top from "./Top.jsx";

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

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

  const handleLikeClick = (uploadId, e) => {
    // Prevent opening the preview when like button is clicked
    e.stopPropagation();
    // TODO: Implement the logic to handle the like button click
    console.log(`Like button clicked for upload with ID: ${uploadId}`);
  };

  // Function to get comments filtered by upload ID
  const getCommentsByUploadId = async (uploadId) => {
    try {
      const response = await getComments();
      return response.data.filter(comment => comment.uploadId === uploadId);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  const fetchComments = async (uploadId) => {
    setCommentLoading(true);
    try {
      // Get comments for this specific upload
      const commentsData = await getCommentsByUploadId(uploadId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleImageClick = async (upload) => {
    setSelectedUpload(upload);
    setIsPreviewOpen(true);
    
    // Fetch comments for this upload
    if (upload && upload.id) {
      fetchComments(upload.id);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    // Add a small delay before removing the selected upload
    // This keeps the content visible during the transition
    setTimeout(() => {
      setSelectedUpload(null);
      setComments([]);
    }, 300);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedUpload) return;
    
    try {
      // Format data for the API
      const formattedData = {
        text: newComment,
        uploadId: selectedUpload.id
      };
      
      // Send to backend
      const response = await createComment(formattedData);
      const addedComment = response.data;
      
      // Update the comments list
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <Top />
      
      <div className={`dashboard-content ${isPreviewOpen ? 'with-preview' : ''}`}>
        <div className={`grid ${isPreviewOpen ? 'shifted' : ''}`}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            uploads.map((upload) => (
              <div 
                className="card" 
                key={upload.id}
                onClick={() => handleImageClick(upload)}
              >
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
                    {upload.User?.username || "Unknown User"}
                  </span>
                  <button
                    className="like"
                    onClick={(e) => handleLikeClick(upload.id, e)}
                  >
                    {upload.isLiked ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preview Panel */}
        {selectedUpload && (
          <div className={`preview-panel ${isPreviewOpen ? 'open' : ''}`}>
            <button className="close-preview" onClick={closePreview}>
              &times;
            </button>
            
            <div className="preview-content">
              <div className="preview-image-container">
                <img
                  src={normalizeImagePath(selectedUpload.imagePath)}
                  alt={selectedUpload.description || 'Selected image'}
                  className="preview-image"
                />
              </div>
              
              <div className="preview-details">
                <div className="preview-header">
                  <h2>{selectedUpload.title || "Untitled"}</h2>
                  <div className="preview-author">
                    By {selectedUpload.User?.username || "Unknown User"}
                  </div>
                </div>
                
                <div className="preview-description">
                  <p>{selectedUpload.description || "No description available."}</p>
                </div>

                <div className="preview-metadata">
                  <div className="timestamp">
                    {new Date(selectedUpload.createdAt).toLocaleDateString()}
                  </div>
                  <div className="actions">
                    <button className="action-button">
                      {selectedUpload.isLiked ? "❤️" : "🤍"} 
                      {selectedUpload.likes || 0}
                    </button>
                    <button className="action-button">
                      💬 {comments.length}
                    </button>
                  </div>
                </div>
                
                <div className="comments-section">
                  <h3>Comments</h3>
                  
                  <div className="comments-list">
                    {commentLoading ? (
                      <p className="loading-comments">Loading comments...</p>
                    ) : comments.length > 0 ? (
                      comments.map(comment => (
                        <div className="comment" key={comment.id}>
                          <div className="comment-header">
                            <strong>{comment.User?.username || "User"}</strong>
                            <span className="comment-time">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                  
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <button type="submit" className="submit-comment">
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;