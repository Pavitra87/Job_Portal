import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useAuth } from "../../authenticated/AuthContext";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
const Header = () => {
  const { user, logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user && !user.role) {
      console.warn(
        "User role is undefined. Please check user role assignment."
      );
    }
  }, [user]);

  const storedUserRole = JSON.parse(localStorage.getItem("user"))?.role;
  const userRole = user?.role || storedUserRole;
  const profilePictureUrl = user.profile_picture_url || "/default-profile.png";

  const username = user?.username || "User Profile";
  // console.log("User object:", user);
  // console.log("Profile Picture URL:", profilePictureUrl);

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
        <div className="sidenav">
          <div className="middlenav">
            <ul>
              <li className="home">
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/category">Category</Link>
              </li>
              {userRole === "Job Seeker" && (
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
              )}
              {userRole === "Job Provider" && (
                <>
                  <li>
                    <Link to="/post-job">Post Job</Link>
                  </li>
                  <li>
                    <Link to="/candidate-list">Candidates</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="rightnav">
            {user ? (
              <div className="user-profile">
                <img
                  src={profilePictureUrl}
                  alt={username}
                  className="profile-picture"
                  onClick={toggleDropdown}
                />
                {showDropdown && (
                  <div className="dropdown" ref={dropdownRef}>
                    <Link to="/userprofile">
                      <FaRegUser />
                      <span>Profile</span>
                    </Link>
                    <button onClick={logout} className="logout">
                      <MdOutlineLogout />
                      <span> Logout</span>
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
    </div>
  );
};

export default Header;
