import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/book-service", label: "Book Service" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const visibleLinks = user?.role === "admin" ? [{ to: "/admin", label: "Dashboard" }] : links;
  const signOut = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          KrishD_<span>Motors</span>
        </NavLink>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              {user.role === "user" && <NavLink to="/dashboard" onClick={() => setOpen(false)}>My Bookings</NavLink>}
              <button className="nav-auth" onClick={signOut}>Logout</button>
            </>
          ) : <NavLink className="nav-auth-link" to="/login" onClick={() => setOpen(false)}>Login</NavLink>}
        </nav>

        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
