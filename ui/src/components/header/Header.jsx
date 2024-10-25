import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <div className="navbar">
      <div className="nav">
        <div className="icon">
          <h1>JOB PORTAL</h1>
        </div>
        <div className="middlenav">
          <ul>
            <li>Home</li>
            <li>Find Jobs</li>
            <li>Candidates</li>
          </ul>
        </div>
        <div className="rightnav">
          <div className="btns">
            <Link>Register</Link>
            <Link>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
