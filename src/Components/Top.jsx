import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { getCategories } from "../api/api";
import "./../styles/top.css";

const Top = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories when component mounts
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        navigate("/");
    };
    
    const handleCategorySelect = (categoryId) => {
        // Navigate to a filtered page or update the current page
        navigate(`/category/${categoryId}`);
        setCategoryDropdownOpen(false);
    };

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
                <div className="dropdown">
                    <BiCategory size={30} className="icon" onClick={toggleCategoryDropdown} />
                    {categoryDropdownOpen && (
                        <div className="dropdown-menu">
                            {categories.map(category => (
                                <a 
                                    key={category.id} 
                                    href="#"
                                    onClick={() => handleCategorySelect(category.id)}
                                >
                                    {category.categoryName}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dropdown">
                    <CgProfile size={30} className="icon" onClick={toggleProfileDropdown} />
                    {profileDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile">Profile</Link>
                            <a href="#" onClick={handleLogout}>Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Top;