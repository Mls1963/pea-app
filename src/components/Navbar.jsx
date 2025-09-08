import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        backgroundColor: "#1e1e2f",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
      }}
    >
      <h2 style={{ color: "#4cafef", margin: 0 }}>PEA App</h2>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/" style={linkStyle}>
          📊 Dashboard
        </Link>
        <Link to="/saisie" style={linkStyle}>
          ✍️ Saisie
        </Link>
        <Link to="/parametres" style={linkStyle}>
          ⚙️ Paramètres
        </Link>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: "#f5f5f5",
  textDecoration: "none",
  fontWeight: "500",
  transition: "color 0.2s",
};

export default Navbar;
