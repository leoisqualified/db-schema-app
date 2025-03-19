import { useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const title = location.state?.title || "KeyMap"; // Show project title if available

  return (
    <nav className="navbar">
      <h2 className="logo">KeyMap</h2>
      <h3 className="nav-title">{title}</h3>
      <img className="user-avatar"></img>
    </nav>
  );
}

export default Navbar;
