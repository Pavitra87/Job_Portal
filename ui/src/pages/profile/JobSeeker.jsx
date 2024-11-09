import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./jobseeker.css";

const JobSeeker = () => {
  const [formData, setFormData] = useState({
    jobtitle: "",
    skills: "",
    resume: null,
    experience: "",
    location: "",
    education: "",
    phone_number: "",
    jobtype: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("jobtitle", formData.jobtitle);
    data.append("skills", formData.skills);

    data.append("experience", formData.experience);
    data.append("location", formData.location);
    data.append("education", formData.education);
    data.append("phone_number", formData.phone_number);
    data.append("jobtype", formData.jobtype);

    try {
      await axios.post("http://localhost:5001/api/auth/seeker", data);
      setMessage("Profile created successfully!");
      navigate("/"); // Navigate to job seeker dashboard
    } catch (error) {
      setMessage("Error creating profile. Please try again.");
      console.error("Profile error:", error);
    }
  };

  return (
    <div className="job-seeker-profile">
      <h1>Job Seeker Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="jobtitle"
          placeholder="Job Title"
          value={formData.jobtitle}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
          required
        />
        {/* <input type="file" name="resume" onChange={handleFileChange} required /> */}
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
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
          name="education"
          placeholder="Education"
          value={formData.education}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="jobtype"
          placeholder="jobtype"
          value={formData.jobtype}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Profile</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default JobSeeker;
