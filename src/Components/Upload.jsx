import "./../styles/Upload.css"; // ✅ Ensure this file exists

const Upload = ({ onClose }) => {
  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Upload Your Image</h2>
        <input type="file" />
        <input type="text" placeholder="Caption" />
        <input type="text" placeholder="Tags (e.g., nature, travel)" />
        <div className="buttons">
          <button onClick={onClose} className="cancel">Cancel</button>
          <button className="submit">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
