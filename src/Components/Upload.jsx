import { useState } from "react";
import { createUpload } from "../api/api";
import "./../styles/Upload.css";

const Upload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      setUploading(true); // Set uploading state to true when starting upload
      console.log("Uploading with userId:", userId);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description || '');
      formData.append("userId", userId);

      const response = await createUpload(formData);
      console.log("Upload response:", response.data);
      alert("Upload successful!");
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error?.response?.data?.error || "Unknown error"}`);
    } finally {
      setUploading(false); // Reset uploading state whether successful or not
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Upload Your Image</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading}
        />
        <input
          type="text"
          placeholder="Caption"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploading}
        />
        <input
          type="text"
          placeholder="Tags (e.g., nature, travel)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={uploading}
        />
        <div className="buttons">
          <button 
            onClick={onClose} 
            className="cancel" 
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="submit" 
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
        {uploading && <p>Upload in progress...</p>}
      </div>
    </div>
  );
};

export default Upload;