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
      const response = await registerUser({ email, username, password });

      // Debugging response to ensure correct structure
      console.log("📥 Register Response:", response.data); 

      // Extract user details from response
      const { token, username: savedUsername, isAdmin, userId } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", savedUsername);
      localStorage.setItem("isAdmin", isAdmin);

      // Redirect to login on success
      navigate("/login");
    } catch (err) {
      // Handle registration errors
      console.error("🚨 Registration Error:", err.response?.data || err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="right-section">
          <img src="/logo.png" alt="Register Illustration" />
        </div>
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
