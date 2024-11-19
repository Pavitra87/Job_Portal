import React, { useState, useContext } from "react";
import axios from "axios";
import "./createjob.css";
import { useAuth } from "../../authenticated/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateJobApplication = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    preferredSkills: "",
    address: "",
    education: "",
    experience: "",
    salary_range: "",

    posted_at: new Date().toISOString().split("T")[0], // Today's date
    expires_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5001/api/jobListing/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Job listing created successfully!");
      setFormData({
        title: "",
        description: "",
        requirements: "",
        preferredSkills: "",
        address: "",
        education: "",
        experience: "",
        salary_range: "",

        posted_at: new Date().toISOString().split("T")[0],
        expires_at: "",
      });
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : err.message;
      setError("Error creating job listing: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-listing-form">
      <h2>{t("createjoblist.createJobListing")}</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder={t("createjoblist.jobTitle")}
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder={t("createjoblist.jobDescription")}
          value={formData.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="requirements"
          placeholder={t("createjoblist.requirements")}
          value={formData.requirements}
          onChange={handleChange}
        />
        <input
          name="preferredSkills"
          placeholder={t("createjoblist.preferredSkills")}
          value={formData.preferredSkills}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder={t("createjoblist.address")}
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="education"
          placeholder={t("createjoblist.education")}
          value={formData.education}
          onChange={handleChange}
        />
        <input
          type="text"
          name="experience"
          placeholder={t("createjoblist.experience")}
          value={formData.experience}
          onChange={handleChange}
        />
        <input
          type="text"
          name="salary_range"
          placeholder={t("createjoblist.salaryRange")}
          value={formData.salary_range}
          onChange={handleChange}
        />

        <input
          type="date"
          name="posted_at"
          placeholder={t("createjoblist.postedAt")}
          value={formData.posted_at}
          onChange={handleChange}
        />
        <input
          type="date"
          name="expires_at"
          placeholder={t("createjoblist.expiresAt")}
          value={formData.expires_at}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {t("createjoblist.submit")}
        </button>
      </form>
    </div>
  );
};

export default CreateJobApplication;
