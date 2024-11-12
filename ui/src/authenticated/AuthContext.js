import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedtoken = localStorage.getItem("token");

    if (storedUser && storedtoken) {
      try {
        setUser(storedUser);
        setToken(storedtoken);
      } catch (error) {
        console.error("Failed to parse user from local storage:", error);
      }
    } else {
      console.warn("No user found in local storage.");
    }
  }, []);

  const login = (userData) => {
    console.log("Logging in user with data:", userData);

    const updatedUser = {
      ...userData,
      profile_picture_url:
        userData.profile_picture_url || "/default-profile.png", // Ensure profile URL
    };
    setUser(updatedUser);
    setToken(localStorage.getItem("token"));
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove token if stored separately
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
