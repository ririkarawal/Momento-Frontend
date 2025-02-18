import "./../styles/Register.css";
import { Link } from "react-router-dom";
import "./../styles/Header.css";

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        {/* Right Section (Image) - Move this above Left Section */}
        <div className="right-section">
          <img src="/logo.png" alt="Register Illustration" />
        </div>

        {/* Left Section (Form) */}
        <div className="left-section">
          <h2>Create Account</h2>
          <form>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="email@gmail.com" />
            </div>
            <div className="input-group">
              <label>Phone No</label>
              <input type="text" placeholder="Enter your phone no" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
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
