import { useState, useEffect } from "react";
import { getUploads, getComments, createComment, deleteComment, getCurrentUser } from "../api/api";
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
  const [currentUser, setCurrentUser] = useState(null);

  // Helper function to get token from localStorage
  const getStoredToken = () => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token ? "Found" : "Not found");
    return token;
  };

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

    // Check if we have a token first
    const token = getStoredToken();
    if (token) {
      console.log("Token found, fetching user data");
      // Try to fetch current user if we have a token
      getCurrentUser()
        .then(response => {
          console.log("Current user data:", response.data);
          setCurrentUser(response.data);
        })
        .catch(error => {
          console.error("Error fetching current user:", error);
          // Failed to get user - the token might be invalid
          if (error.response?.status === 401) {
            console.log("Invalid token, clearing localStorage");
            localStorage.removeItem("token");
          }
        });
    } else {
      console.log("No token found, user not logged in");
    }

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
      console.log("Fetched comments:", commentsData);
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
      
      if (error.response?.status === 401) {
        alert("You need to be logged in to add comments.");
      } else {
        alert("Failed to add comment. Please try again.");
      }
    }
  };

  const handleDeleteComment = async (commentId, e) => {
    // Stop event propagation to prevent parent handlers from firing
    if (e) e.stopPropagation();
    
    // Check if user is logged in
    if (!getStoredToken()) {
      alert("You need to be logged in to delete comments.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      console.log("Attempting to delete comment with ID:", commentId);
      
      // Call the delete API
      await deleteComment(commentId);
      console.log("Comment deleted successfully on the server");
      
      // Remove the deleted comment from the state
      setComments(comments.filter(comment => comment.id !== commentId));
      console.log("Comment removed from UI");
      
      alert("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      console.error("Error response:", error.response?.data);
      
      // If unauthorized, show a more specific message
      if (error.response?.status === 401) {
        alert("You need to be logged in to delete comments.");
      } else {
        alert("Failed to delete comment: " + (error.response?.data?.message || "Please try again."));
      }
    }
  };

  // Check if the current user can delete a comment
  const canDeleteComment = (comment) => {
    if (!currentUser || !comment.User) return false;
    
    // User can delete if they are the comment author
    if (comment.userId === currentUser.id) return true;
    
    // User can delete if they are the upload owner
    if (selectedUpload && selectedUpload.userId === currentUser.id) return true;
    
    // Admin can delete any comment
    if (currentUser.isAdmin) return true;
    
    return false;
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
                            {/* Show delete button for all comments during testing */}
                            <button 
                              className="delete-comment-btn" 
                              onClick={(e) => handleDeleteComment(comment.id, e)}
                              style={{
                                backgroundColor: "#ff4d4d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "2px 8px",
                                cursor: "pointer",
                                marginLeft: "10px",
                                fontWeight: "bold"
                              }}
                            >
                              Delete
                            </button>
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