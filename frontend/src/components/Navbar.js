import React from "react";
import logo from "../assets/swapify-logo.png?v=1";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="Swapify Logo" className="nav-logo" />
        <h2 className="nav-title">Swapify</h2>
      </div>

      <div className="nav-right">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/swipe")}>Explore</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </nav>
  );
}

export default Navbar;