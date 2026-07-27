import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            Krish_<span>Motors</span>
          </div>
          <p>
            Trusted two-wheeler servicing with honest pricing and quick
            turnaround, right in your neighborhood.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/book-service">Book Service</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Info</h4>
          <ul>
            <li>+91 88074 36007</li>
            <li>krishnakumarkm2901@gmail.com</li>
            <li>119/15, Pudhu Kadu Bagam, Pampadumpara, Idukki, Kerala</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Krish_Motors Bike Service. All rights reserved.</p>
      </div>
    </footer>
  );
}
