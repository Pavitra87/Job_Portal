import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer-section">
      <div className="footer">
        <div className="heding">
          <h1>Start your Career with us</h1>
        </div>
        <div className="small">
          <p>join our website and make your dreams come true</p>
        </div>
        <div className="join-btn">
          <button>
            <Link to="/login">Join now</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
