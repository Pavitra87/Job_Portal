import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forData, setForData] = useState({});

  const navigate = useNavigate();

  const handleForData = (data) => {
    setForData(data);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedForData = localStorage.getItem("forData");

    if (storedForData) {
      setForData(storedForData);
    }

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        fetchProfile(JSON.parse(storedUser)?.role);
      } catch (error) {
        console.error("Error parsing user or token:", error);
      }
    } else {
      console.warn("No user found in local storage.");
    }
  }, []);

  useEffect(() => {
    if (forData) {
      localStorage.setItem("forData", JSON.stringify(forData));
    }
  }, [forData]);

  useEffect(() => {
    setForData(profileData?.profile);
    localStorage.setItem("forData", JSON.stringify(profileData?.profile));
  }, [profileData?.profile]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("User Profile Data:", response.data);
      setProfileData(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Could not load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    localStorage.removeItem("token");
    localStorage.removeItem("forData"); // Remove token if stored separately
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        profileData,
        fetchProfile,
        handleForData,
        forData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
