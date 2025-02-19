import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { BiCategory } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import "./../styles/top.css";

const Top = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        setCategoryDropdownOpen(false);
    };

    const toggleCategoryDropdown = () => {
        setCategoryDropdownOpen(!categoryDropdownOpen);
        setProfileDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest(".dropdown")) {
            setProfileDropdownOpen(false);
            setCategoryDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <h1>Momento</h1>
            </div>

            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <span className="search-icon">🔍</span>
            </div>

            <div className="nav-icons">
                {/* Category Dropdown */}
                <div className="dropdown">
                    <BiCategory size={30} className="icon" onClick={toggleCategoryDropdown} />
                    {categoryDropdownOpen && (
                        <div className="dropdown-menu">
                            <a href="#">Category 1</a>
                            <a href="#">Category 2</a>
                            <a href="#">Category 3</a>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="dropdown">
                    <CgProfile size={30} className="icon" onClick={toggleProfileDropdown} />
                    {profileDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile">Profile</Link>  {/* Navigate to Profile Page */}
                            <a href="#">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Top;
