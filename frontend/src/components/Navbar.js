import React from "react";
import logo from "../assets/swapify-logo.png?v=1";

function Navbar() {
  return (
    <div style={styles.nav}>
      <img src={logo} alt="Swapify-Logo" style={styles.logo} />
      <h2 style={styles.title}>Swapify</h2>

      <div style={{ marginLeft: "auto" }}>
        <button>Home</button>
        <button>Explore</button>
        <button>Login</button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#0f172a",
    color: "white",
  },
  logo: {
    height: "80px",
    marginRight: "5px",
  },
  title: {
    fontWeight: "bold",
  },
};

export default Navbar;