import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";
import Avatar from "../assets/avatar.avif";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || ""; // Show project title if available
  const [isMenuOpen, setIsMenuOpen] = useState(
    localStorage.getItem("menuOpen") === "true" // Get state from local storage
  );

  useEffect(() => {
    localStorage.setItem("menuOpen", isMenuOpen); // Save state to local storage
  }, [isMenuOpen]);

  // Handle icon click: toggle state and navigate
  const handleMenuClick = () => {
    if (!isMenuOpen) {
      navigate("/chat-history"); // Go to Chat History
    } else {
      navigate(-1); // Go back to the previous page
    }
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h2 className="logo">KeyMap</h2>
      </Link>
      <h3 className="nav-title">{title}</h3>

      {/* Hamburger / X Icon - Toggle and Navigate */}
      {isMenuOpen ? (
        <FaTimes className="menu-icon" onClick={handleMenuClick} />
      ) : (
        <FaBars className="menu-icon" onClick={handleMenuClick} />
      )}

      {/* User Avatar */}
      <img className="user-avatar" src={Avatar} alt="User Avatar" />
    </nav>
  );
}

export default Navbar;
