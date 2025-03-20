import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaBars } from "react-icons/fa"; // Import hamburger icon
import Avatar from "../assets/avatar.avif";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || ""; // Show project title if available

  return (
    <nav className="navbar">
      <h2 className="logo">KeyMap</h2>
      <h3 className="nav-title">{title}</h3>

      {/* Hamburger Icon - Navigate to Chat History */}
      <FaBars
        className="hamburger-icon"
        onClick={() => navigate("/chat-history")}
      />

      {/* User Avatar */}
      <img className="user-avatar" src={Avatar} alt="User Avatar" />
    </nav>
  );
}

export default Navbar;
