import "./../styles/Dashboard.css";
import Top from "./../Components/top.jsx";

const Dashboard = () => {
  const images = [
    { id: 1, username: "User1", url: "https://via.placeholder.com/150" },
    { id: 2, username: "User2", url: "https://via.placeholder.com/150" },
    { id: 3, username: "User3", url: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="dashboard">
      <Top />
      <div className="grid">
        {images.map((image) => (
          <div className="card" key={image.id}>
            <div className="img-wrap">
              <img src={image.url} alt="Uploaded" className="img-box" />
            </div>
            <div className="info">
              <span className="username">{image.username}</span>
              <button className="like">❤️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
