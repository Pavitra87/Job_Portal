import React, { useEffect, useState } from "react";
import axios from "axios";
import "./candidate.css";
import notfound1 from "../../assets/notfound1.png";
import { useTranslation } from "react-i18next";
const Candidates = () => {
  const { t } = useTranslation();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    skills: "",
    education: "",
    phone_number: "",
    jobtitle: "",
    experience: "",
    jobtype: "",
    resume: null,
  });

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/auth/profiles",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setJobSeekers(response.data);
      } catch (err) {
        console.error("Error fetching job seekers:", err);
        setError("Could not fetch job seekers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobSeekers();
  }, []);

  const filteredCandidates = jobSeekers.filter((candidate) => {
    const { skills, education, jobtitle, experience } = filters;

    const matchskills = skills
      ? candidate.profile?.skills &&
        candidate.profile.skills.toLowerCase().includes(skills.toLowerCase())
      : true;

    const matcheducation = education
      ? candidate.profile?.education &&
        candidate.profile.education
          .toLowerCase()
          .includes(education.toLowerCase())
      : true;

    const matchjobtitle = jobtitle
      ? candidate.profile?.jobtitle &&
        candidate.profile.jobtitle
          .toLowerCase()
          .includes(jobtitle.toLowerCase())
      : true;

    const matchexperience = experience
      ? candidate.profile?.experience &&
        candidate.profile.experience
          .toLowerCase()
          .includes(experience.toLowerCase())
      : true;

    return matcheducation && matchskills && matchexperience && matchjobtitle;
  });

  if (loading) return <p>Loading job seekers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="candidates-container">
      <h2>{t("candidates.heading")}</h2>
      <div className="filter-contains-candidate">
        <div className="filter-container">
          <div className="filter-contain-sticky">
            <h4>Find Candidates</h4>
            <form className="filter-form">
              <div className="filter-field">
                <label htmlFor="jobtitle">
                  {t("candidates.filters.job_title")}
                </label>
                <input
                  id="jobtitle"
                  type="text"
                  placeholder={t("candidates.filters.job_title")}
                  value={filters.jobtitle}
                  onChange={(e) =>
                    setFilters({ ...filters, jobtitle: e.target.value })
                  }
                />
              </div>
              <div className="filter-field">
                <label htmlFor="skills">{t("candidates.filters.skills")}</label>
                <input
                  id="skills"
                  type="text"
                  placeholder={t("candidates.filters.skills")}
                  value={filters.skills}
                  onChange={(e) =>
                    setFilters({ ...filters, skills: e.target.value })
                  }
                />
              </div>
              <div className="filter-field">
                <label htmlFor="education">
                  {t("candidates.filters.education")}
                </label>
                <input
                  id="education"
                  type="text"
                  placeholder={t("candidates.filters.education")}
                  value={filters.education}
                  onChange={(e) =>
                    setFilters({ ...filters, education: e.target.value })
                  }
                />
              </div>
              <div className="filter-field">
                <label htmlFor="experience">
                  {t("candidates.filters.experience")}
                </label>
                <input
                  id="experience"
                  type="text"
                  placeholder={t("candidates.filters.experience")}
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters({ ...filters, experience: e.target.value })
                  }
                />
              </div>
            </form>
          </div>
        </div>

        <ul className="candidate-details">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((jobSeeker) => (
              <li key={jobSeeker.id}>
                <h3>{jobSeeker.profile?.jobtitle || "N/A"}</h3>

                <p>
                  <strong>{t("candidates.profile_details.name")}</strong>
                  <span>{jobSeeker.username}</span>
                </p>
                <p>
                  <strong>{t("candidates.profile_details.email")} </strong>
                  <span> {jobSeeker.email}</span>
                </p>
                <p>
                  <strong>{t("candidates.profile_details.education")}</strong>
                  <span> {jobSeeker.profile?.education || "N/A"}</span>
                </p>
                <p>
                  <strong>{t("candidates.profile_details.location")}</strong>
                  <span> {jobSeeker.profile?.location || "N/A"}</span>
                </p>
                <p>
                  <strong>
                    {t("candidates.profile_details.contactNumber")}
                  </strong>
                  <span> {jobSeeker.profile?.phone_number || "N/A"}</span>
                </p>

                <p className="skills">
                  <strong>{t("candidates.profile_details.skills")}</strong>
                  <span className="chips">
                    {jobSeeker.profile?.skills
                      ? jobSeeker.profile.skills
                          .split(",")
                          .map((skill, index) => (
                            <span key={index} className="chip">
                              {skill.trim()}
                            </span>
                          ))
                      : "N/A"}
                  </span>
                </p>

                <p>
                  <strong>{t("candidates.profile_details.experience")}</strong>
                  <span> {jobSeeker.profile?.experience || "N/A"}</span>
                </p>
                <p>
                  <strong>{t("candidates.profile_details.jobtype")}</strong>
                  <span>{jobSeeker.profile?.jobtype || "N/A"}</span>
                </p>
                <p>
                  <strong>{t("candidates.profile_details.resume")}</strong>
                  {jobSeeker.profile?.resume ? (
                    <>
                      {console.log(
                        "Resume seeker path:",
                        jobSeeker.profile?.resume
                      )}
                      <a
                        href={`http://localhost:5001/${jobSeeker.profile?.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-link"
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          fontSize: "13px",
                        }}
                      >
                        View Resume
                      </a>
                    </>
                  ) : (
                    "No resume uploaded"
                  )}
                </p>
              </li>
            ))
          ) : (
            <img
              src={notfound1}
              alt="No job listings found"
              className="notfound"
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default Candidates;
