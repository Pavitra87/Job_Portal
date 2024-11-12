import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./jobprovider.css";
import { useAuth } from "../../authenticated/AuthContext";

const JobProvider = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    phone_number: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authorization token is missing. Please log in again.");
        return;
      }

      await axios.post(`http://localhost:5001/api/auth/provider`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile created successfully!");
      navigate("/"); // Redirect to provider dashboard or home page
    } catch (error) {
      setMessage("Error creating profile. Please try again.");
      console.error("Profile error:", error);
    }
  };

  if (!user) {
    // Display a loading message or redirect to login if user is not available
    return <p>Loading...</p>;
  }

  return (
    <div className="job-provider-profile">
      <h1>Job Provider Profile</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Contact Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Profile</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default JobProvider;
