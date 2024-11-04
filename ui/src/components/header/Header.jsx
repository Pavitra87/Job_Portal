import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useAuth } from "../../authenticated/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const userRole = user?.roleName;
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user && user.roleName) {
      console.warn(
        "User role is undefined. Please check user role assignment."
      );
    }
  }, [user]);
  console.log("userHeader", user, "userRole", userRole);
  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <Link to="/jobs">Jobs</Link>
            </li>

            <>
              <li>
                <Link to="/post-job">Post Job</Link>
              </li>
              <li>
                <Link to="/candidate-list">Candidates</Link>
              </li>
            </>
          </ul>
        </div>
        <div className="rightnav">
          {user ? (
            <div className="user-profile">
              <img
                src={user.profile_picture_url || "/default-profile.png"}
                alt="Profile"
                className="profile-picture"
                onClick={toggleDropdown}
              />

              {showDropdown && (
                <div className="dropdown" ref={dropdownRef}>
                  <Link to="/userprofile"> Profile</Link>
                  <button onClick={logout} className="logout">
                    Logout
                  </button>
                </div>
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
