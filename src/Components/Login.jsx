import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api"; // Your API call for login
import "./../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // To redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.data.token);
      // Ensure there is no space in the route
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <h2>Welcome Back!</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
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
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="signup-text">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
        <div className="right-section">
          <img src="/logo.png" alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;
