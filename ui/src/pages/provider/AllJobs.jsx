import React, { useEffect, useState } from "react";
import axios from "axios";
import "./alljob.css";
import notfound1 from "../../assets/notfound1.png";
import { useAuth } from "../../authenticated/AuthContext";
import { useTranslation } from "react-i18next";

const AllJobs = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    preferredSkills: "",
    education: "",
    address: "",
    salary_range: "",
    experience: "",
  });

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5001/api/jobListing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobListings(response.data);
      } catch (err) {
        setError("Error fetching job listings: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  const applyForJob = async (jobId) => {
    const seekerId = user.id;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5001/api/jobApplications/apply`,
        { jobId, seekerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error applying for job: " + err.message);
    }
  };

  const filteredJobs = jobListings.filter((job) => {
    const {
      title,
      preferredSkills,
      address,
      education,
      experience,
      salary_range,
    } = filters;

    const matchTitle = title
      ? job.title.toLowerCase().includes(title.toLowerCase())
      : true;

    const matchPreferredSkills = preferredSkills
      ? job.preferredSkills
          .toLowerCase()
          .includes(preferredSkills.toLowerCase())
      : true;

    const matchEducation = education
      ? job.education.toLowerCase().includes(education.toLowerCase())
      : true;

    const matchExperience = experience
      ? job.experience.toLowerCase().includes(experience.toLowerCase())
      : true;
    const matchAddress = address
      ? job.address.toLowerCase().includes(address.toLowerCase())
      : true;

    const matchSalary = salary_range
      ? job.salary_range.toLowerCase().includes(salary_range.toLowerCase())
      : true;

    return (
      matchTitle &&
      matchPreferredSkills &&
      matchExperience &&
      matchEducation &&
      matchAddress &&
      matchSalary
    );
  });

  if (loading) return <p>Loading job listings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <div className="jobs-container">
        <h2>{t("createjoblist.alljobtitle")}</h2>
        <div className="filter-contains-jobs">
          <div className="filter-container">
            <div className="filter-contain-sticky">
              <h4>Find Your Job</h4>
              <form className="filter-form">
                <div className="filter-field">
                  <label htmlFor="jobtitle">
                    {t("createjoblist.jobTitle")}:
                  </label>
                  <input
                    id="jobtitle"
                    type="text"
                    placeholder={t("createjoblist.jobTitle")}
                    value={filters.title}
                    onChange={(e) =>
                      setFilters({ ...filters, title: e.target.value })
                    }
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="jobtitle">
                    {t("createjoblist.preferredSkills")}:
                  </label>
                  <input
                    type="text"
                    placeholder={t("createjoblist.preferredSkills")}
                    value={filters.preferredSkills}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        preferredSkills: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="education">
                    {t("createjoblist.education")}:
                  </label>
                  <input
                    id="education"
                    type="text"
                    placeholder={t("createjoblist.education")}
                    value={filters.education}
                    onChange={(e) =>
                      setFilters({ ...filters, education: e.target.value })
                    }
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="experience">
                    {t("createjoblist.experience")}:
                  </label>
                  <input
                    id="experience"
                    type="text"
                    placeholder={t("createjoblist.experience")}
                    value={filters.experience}
                    onChange={(e) =>
                      setFilters({ ...filters, experience: e.target.value })
                    }
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="address">{t("createjoblist.address")}:</label>
                  <input
                    id="address"
                    type="text"
                    placeholder={t("createjoblist.address")}
                    value={filters.address}
                    onChange={(e) =>
                      setFilters({ ...filters, address: e.target.value })
                    }
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="salary">
                    {t("createjoblist.salaryRange")}:
                  </label>
                  <input
                    type="text"
                    placeholder={t("createjoblist.salaryRange")}
                    value={filters.salary_range}
                    onChange={(e) =>
                      setFilters({ ...filters, salary_range: e.target.value })
                    }
                  />
                </div>
              </form>
            </div>
          </div>
          <ul className="job-details">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <li key={job.id}>
                  <h3>{job.title}</h3>
                  <p>
                    <strong>{t("createjoblist.jobDescription")}:</strong>
                    <span>{job.description}</span>
                  </p>
                  <p>
                    <strong>{t("createjoblist.address")}:</strong>{" "}
                    <span>{job.address}</span>
                  </p>
                  <p>
                    <strong>{t("createjoblist.education")}:</strong>
                    <span>{job.education}</span>
                  </p>
                  <p>
                    <strong>{t("createjoblist.experience")}:</strong>
                    <span>{job.experience}</span>
                  </p>
                  <p>
                    <strong>{t("createjoblist.requirements")}:</strong>
                    <span>{job.requirements}</span>
                  </p>
                  <p className="skills">
                    <strong>{t("createjoblist.preferredSkills")}:</strong>
                    <span className="chips">
                      {job.preferredSkills
                        ? job.preferredSkills.split(",").map((skill, index) => (
                            <span key={index} className="chip">
                              {skill.trim()}
                            </span>
                          ))
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>{t("createjoblist.salaryRange")}:</strong>{" "}
                    <span>{job.salary_range}</span>
                  </p>
                  <p>
                    <strong>{t("createjoblist.postedAt")}:</strong>{" "}
                    {new Date(job.posted_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>{t("createjoblist.expiresAt")}:</strong>{" "}
                    {new Date(job.expires_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => applyForJob(job.id)}
                    disabled={appliedJobs.includes(job.id)}
                  >
                    {t("createjoblist.applyjob")}
                    {/* {appliedJobs.includes(job.id) ? "Applied" : "Apply for job"} */}
                  </button>
                </li>
              ))
            ) : (
              <div className="notfound-img">
                <img
                  src={notfound1}
                  alt="No job listings found"
                  className="notfound"
                />
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AllJobs;
