import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./jobseeker.css";
import { useAuth } from "../../authenticated/AuthContext";
import { useTranslation } from "react-i18next";

const JobSeeker = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    location: "",
    skills: "",
    education: "",
    phone_number: "",
    jobtitle: "",
    experience: "",
    jobtype: "",
    resume: null,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, resume: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authorization token is missing. Please log in again.");
        return;
      }

      await axios.post("http://localhost:5001/api/auth/seeker", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Profile created successfully!");
      navigate("/"); // Navigate to job seeker dashboard
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
    <div className="job-seeker-profile">
      <h1>{t("jobSeekerProfile.jobSeekerProfile")}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="jobtitle"
          placeholder={t("jobSeekerProfile.jobTitle")}
          value={formData.jobtitle}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder={t("jobSeekerProfile.skills")}
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="experience"
          placeholder={t("jobSeekerProfile.experience")}
          value={formData.experience}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder={t("jobSeekerProfile.location")}
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="education"
          placeholder={t("jobSeekerProfile.education")}
          value={formData.education}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder={t("jobSeekerProfile.phoneNumber")}
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="jobtype"
          placeholder={t("jobSeekerProfile.jobType")}
          value={formData.jobtype}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {/* <button type="submit">Upload</button> */}
        <button type="submit">{t("jobSeekerProfile.createProfile")}</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default JobSeeker;
