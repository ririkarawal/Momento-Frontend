import { useState } from "react";
import { createUpload } from "../api/api"; 
import "./../styles/Upload.css";

const Upload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleFileChange = (e) => { 
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
        alert("Please select a file before uploading.");
        return;
    }

    console.log("Uploading file:", file); // ✅ Check if file exists

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("isLiked", false);
    formData.append("UserId", 1);

    try {
        const response = await createUpload(formData);
        console.log("Upload successful:", response.data);
        alert("Upload successful!");
        onClose();
    } catch (error) {
        console.error("Upload failed:", error.response);
        alert(`Upload failed: ${error.response?.data?.error || "Unknown error"}`);
    }
};


  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Upload Your Image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Caption"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (e.g., nature, travel)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="buttons">
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
