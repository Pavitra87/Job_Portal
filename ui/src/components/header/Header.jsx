import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useAuth } from "../../authenticated/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const showLogoutbtn = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };
  return (
    <div className="navbar">
      <div className="nav">
        <div className="icon">
          <h1>JOB PORTAL</h1>
        </div>
        <div className="middlenav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/category">Category</Link>
            </li>
            <li>
              <Link>Jobs</Link>
            </li>
            <li>
              <Link>Candidates</Link>
            </li>
          </ul>
        </div>
        <div className="rightnav">
          {user ? (
            <div className="user-profile">
              <img
                src={user.profile_picture_url}
                alt="Profile"
                className="profile-picture"
                onClick={showLogoutbtn}
              />
              {showDropdown && (
                <div className="dropdown">
                  <button onClick={logout} className="logout">
                    Logout
                  </button>
                </div>
              )}

              {user.role === "Job Provider" ? (
                <button className="post-jobs-button">
                  <Link to="/post-job">Post Job</Link>
                </button>
              ) : (
                <button className="wants-job-button">
                  <Link to="/wants-job">Wants Job</Link>
                </button>
              )}
            </div>
          ) : (
            <div className="btns">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
