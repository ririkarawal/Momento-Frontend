import { useState, useEffect } from "react";
import { createUpload, getCategories } from "../api/api";
import "./../styles/Upload.css";

const Upload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
      setUploading(true);
      console.log("Uploading with userId:", userId, "categoryId:", categoryId);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description || '');
      formData.append("userId", userId);
      if (categoryId) {
        formData.append("categoryId", categoryId);
      }

      const response = await createUpload(formData);
      console.log("Upload response:", response.data);
      alert("Upload successful!");
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error?.response?.data?.error || "Unknown error"}`);
    } finally {
      setUploading(false);
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
        {/* Category dropdown instead of tags */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={uploading}
          className="category-select"
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
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