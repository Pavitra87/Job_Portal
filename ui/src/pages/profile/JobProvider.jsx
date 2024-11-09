import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./jobprovider.css";

const JobProvider = () => {
  const [formData, setFormData] = useState({
    description: "",
    location: "",
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
      await axios.post("http://localhost:5001/api/auth/provider", formData);
      setMessage("Profile created successfully!");
      navigate("/"); // Navigate to job provider dashboard
    } catch (error) {
      setMessage("Error creating profile. Please try again.");
      console.error("Profile error:", error);
    }
  };

  return (
    <div className="job-provider-profile">
      <h1>Job Provider Profile</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          placeholder="Company Description"
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
