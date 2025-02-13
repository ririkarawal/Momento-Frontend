  import "./../styles/Login.css";
  import { Link } from "react-router-dom";
  import "./../styles/Header.css";

  const Login = () => {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="left-section" >
            <h2>Welcome Back!!</h2>
            <form>
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="email@gmail.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
              <button type="submit" className="login-btn">Login</button>
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
