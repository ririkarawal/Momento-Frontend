import { Link } from "react-router-dom";
import "./../styles/Header.css";

const Header = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">Momento</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>

      </ul>
    </nav>
  );
};

export default Header;
