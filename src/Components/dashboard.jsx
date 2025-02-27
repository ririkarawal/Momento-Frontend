import { useState, useEffect } from "react";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { getUploads, getComments, createComment, deleteComment, getCurrentUser, createPin, getPins, deletePin } from "../api/api";
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
  const [pinnedItems, setPinnedItems] = useState({});
  const [followedUsers, setFollowedUsers] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getStoredToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  const normalizeImagePath = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^(uploads[/\\])?/, '');
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  const toggleFollow = (userId, username, e) => {
    e.stopPropagation();
    setFollowedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  useEffect(() => {
    const fetchAllUploads = async () => {
      try {
        const response = await getUploads();
        console.log("Uploads response:", response.data);

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

    const fetchUserPins = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          setIsAuthenticated(false);
          console.log("No token, user not authenticated");
          return;
        }

        setIsAuthenticated(true);
        const pinsResponse = await getPins();
        console.log("Pins response:", pinsResponse.data);

        // Create a map of pinned upload IDs
        const pinMap = {};
        pinsResponse.data.forEach(pin => {
          // Handle different capitalizations and verify data
          const uploadId = pin.uploadId || pin.uploadid ||
            (pin.Upload && pin.Upload.id) ||
            (pin.upload && pin.upload.id);

          if (uploadId) {
            pinMap[uploadId] = pin.id;
          }
        });

        console.log("Pin map:", pinMap);
        setPinnedItems(pinMap);
      } catch (error) {
        console.error("Error fetching pins:", error);
        // If 401, user is not authenticated
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
        }
      }
    };

    fetchAllUploads();
    fetchUserPins();

    // Listen for storage events for pin updates
    const handleStorageChange = () => {
      if (localStorage.getItem('pinsUpdated') === 'true') {
        localStorage.removeItem('pinsUpdated');
        fetchUserPins();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

    if (upload && upload.id) {
      fetchComments(upload.id);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => {
      setSelectedUpload(null);
      setComments([]);
    }, 300);
  };

  const isImagePinned = (uploadId) => {
    return Boolean(pinnedItems[uploadId]);
  };

  const togglePin = async (e) => {
    e.stopPropagation();

    if (!selectedUpload) {
      console.error('No upload selected');
      return;
    }

    if (!isAuthenticated) {
      alert("You need to be logged in to pin/unpin images.");
      return;
    }

    try {
      const uploadId = selectedUpload.id;

      if (isImagePinned(uploadId)) {
        // Get the pin ID for this upload
        const pinId = pinnedItems[uploadId];

        if (!pinId) {
          console.error('Pin ID not found for upload', uploadId);
          return;
        }

        console.log('Attempting to unpin:', { pinId, uploadId });

        try {
          await deletePin(pinId);

          // Update pinned items state
          setPinnedItems(prevPins => {
            const updatedPins = { ...prevPins };
            delete updatedPins[uploadId];
            return updatedPins;
          });

          // Notify other components
          localStorage.setItem('pinsUpdated', 'true');
          window.dispatchEvent(new Event('storage'));

          alert('Image unpinned successfully');
        } catch (error) {
          console.error('Error deleting pin:', error);

          // If 404, update UI anyway
          if (error.response?.status === 404) {
            setPinnedItems(prevPins => {
              const updatedPins = { ...prevPins };
              delete updatedPins[uploadId];
              return updatedPins;
            });
            alert('Pin already removed');
          } else {
            alert(error.response?.data?.message || 'Failed to unpin image');
          }
        }
      } else {
        // Create a new pin
        try {
          console.log('Creating pin for upload ID:', uploadId);
          const response = await createPin({ uploadId: uploadId });
          console.log('Pin creation response:', response.data);

          // Update pinned items state
          setPinnedItems(prevPins => ({
            ...prevPins,
            [uploadId]: response.data.id
          }));

          // Notify other components
          localStorage.setItem('pinsUpdated', 'true');
          window.dispatchEvent(new Event('storage'));

          alert('Image pinned successfully');
        } catch (error) {
          console.error('Error creating pin:', error.response?.data || error);

          // If already pinned, update the UI
          if (error.response?.status === 409) {
            const existingPin = error.response.data.pin;
            setPinnedItems(prevPins => ({
              ...prevPins,
              [uploadId]: existingPin.id
            }));
            alert('You have already pinned this image');
          } else {
            alert(error.response?.data?.message || 'Failed to pin image');
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error during pin toggle:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedUpload) return;

    if (!isAuthenticated) {
      alert("You need to be logged in to add comments.");
      return;
    }

    try {
      const formattedData = {
        text: newComment,
        uploadId: selectedUpload.id
      };

      const response = await createComment(formattedData);
      const addedComment = response.data;

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
    if (e) e.stopPropagation();

    if (!isAuthenticated) {
      alert("You need to be logged in to delete comments.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      alert("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);

      if (error.response?.status === 401) {
        alert("You need to be logged in to delete comments.");
      } else {
        alert("Failed to delete comment: " + (error.response?.data?.message || "Please try again."));
      }
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
                    className="follow"
                    onClick={(e) => toggleFollow(upload.User?.id, upload.User?.username, e)}
                  >
                    {followedUsers[upload.User?.id] ? <SlUserFollowing /> : <SlUserFollow />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedUpload && (
          <div className={`preview-panel ${isPreviewOpen ? 'open' : ''}`}>
            <button className="close-preview" onClick={closePreview}>
              &times;
            </button>

            <button
              className={`pin-button ${isImagePinned(selectedUpload.id) ? 'pinned' : ''}`}
              onClick={togglePin}
              title={isImagePinned(selectedUpload.id) ? "Unpin image" : "Pin image"}
            >
              📌
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
                    <button
                      className="action-button"
                      onClick={(e) => toggleFollow(selectedUpload.User?.id, selectedUpload.User?.username, e)}
                    >
                      {followedUsers[selectedUpload.User?.id] ? <SlUserFollowing /> : <SlUserFollow />}
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
                            <button
                              className="delete-comment-btn"
                              onClick={(e) => handleDeleteComment(comment.id, e)}
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