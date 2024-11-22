import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useAuth } from "../../authenticated/AuthContext";
import { FaRegUser, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user, logout, loading, forData } = useAuth();
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  console.log("formdata", forData?.location);

  const dropdownRef = useRef(null);

  const storedUserRole = JSON.parse(localStorage.getItem("user"))?.role;

  const userRole = user?.role || storedUserRole;

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="navbar">
      <div className="nav">
        <div className="head-icon">
          <div className="icon">
            <h1>{t("title")}</h1>
          </div>

          <button className="menu-icon" onClick={toggleMenu}>
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`sidenav ${showMenu ? "active" : ""}`}>
          <div className="middlenav">
            <ul>
              <li className="home">
                <Link to="/">{t("navbar.home")}</Link>
              </li>
              <li>
                <Link to="/category">{t("navbar.category")}</Link>
              </li>
              {userRole === "Job Seeker" && (
                <>
                  {forData?.skills ? (
                    <li>
                      <Link to="/jobs">{t("navbar.jobs")}</Link>
                    </li>
                  ) : (
                    <li>
                      <Link to="/seeker">
                        {t("navbar.createProfileSeeker")}
                      </Link>
                    </li>
                  )}
                </>
              )}
              {userRole === "Job Provider" && (
                <>
                  {forData?.location ? (
                    <>
                      <li>
                        <Link to="/post-job">{t("navbar.postJob")}</Link>
                      </li>
                      <li>
                        <Link to="/candidate-list">
                          {t("navbar.candidates")}
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/provider">
                        {t("navbar.createProfileProvider")}
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="rightnav">
            {user ? (
              <div className="user-profile">
                <img
                  src={`http://localhost:5001/${user.profile_picture_url}`}
                  alt={user.name}
                  className="profile-picture"
                  onClick={toggleDropdown}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />

                {showDropdown && (
                  <div className="dropdown" ref={dropdownRef}>
                    <Link to="/userprofile">
                      <FaRegUser />
                      <span>{t("navbar.profile")}</span>
                    </Link>

                    <button onClick={logout} className="logout">
                      <MdOutlineLogout />
                      <span>{t("navbar.logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="btns">
                <Link to="/register">{t("navbar.register")}</Link>
                <Link to="/login">{t("navbar.login")}</Link>
              </div>
            )}
          </div>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default Header;
