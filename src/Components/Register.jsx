import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api"; // Your API call for registration
import "./../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Using username instead of phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For redirection after registration

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ email, username, password });
      navigate("/login"); // Redirect to login on success
    } catch (err) {
      // Adjust this according to your backend's error response property
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Right Section (Illustration/Image) */}
        <div className="right-section">
          <img src="/logo.png" alt="Register Illustration" />
        </div>

        {/* Left Section (Form) */}
        <div className="left-section">
          <h2>Create Account</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>
          <p className="login-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
