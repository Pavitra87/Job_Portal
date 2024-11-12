import React, { useEffect, useState } from "react";
import axios from "axios";
import "./candidate.css";
import notfound from "../../assets/notfound.png";

const Candidates = () => {
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
      <h2>Job Seeker Profiles</h2>
      <div className="filter-contains-candidate">
        <div className="filter-container">
          <div className="filter-contain-sticky">
            <h4>Find Candidates</h4>
            <form className="filter-form">
              <div className="filter-field">
                <label htmlFor="jobtitle">Job Title:</label>
                <input
                  id="jobtitle"
                  type="text"
                  placeholder="Filter by Job Title"
                  value={filters.jobtitle}
                  onChange={(e) =>
                    setFilters({ ...filters, jobtitle: e.target.value })
                  }
                />
              </div>
              <div className="filter-field">
                <label htmlFor="skills">Skills:</label>
                <input
                  id="skills"
                  type="text"
                  placeholder="Filter by Skills"
                  value={filters.skills}
                  onChange={(e) =>
                    setFilters({ ...filters, skills: e.target.value })
                  }
                />
              </div>
              <div className="filter-field">
                <label htmlFor="education">Education:</label>
                <input
                  id="education"
                  type="text"
                  placeholder="Filter by Education"
                  value={filters.education}
                  onChange={(e) =>
                    setFilters({ ...filters, education: e.target.value })
                  }
                />
              </div>
              <div className="filter-field">
                <label htmlFor="experience">Experience:</label>
                <input
                  id="experience"
                  type="text"
                  placeholder="Filter by Experience"
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
                  <strong>Name:</strong>
                  <span>{jobSeeker.username}</span>
                </p>
                <p>
                  <strong>Email: </strong>
                  <span> {jobSeeker.email}</span>
                </p>
                <p>
                  <strong>Education:</strong>
                  <span> {jobSeeker.profile?.education || "N/A"}</span>
                </p>
                <p>
                  <strong>Location:</strong>
                  <span> {jobSeeker.profile?.location || "N/A"}</span>
                </p>
                <p>
                  <strong>Phone Number:</strong>
                  <span> {jobSeeker.profile?.phone_number || "N/A"}</span>
                </p>

                <p className="skills">
                  <strong>Skills:</strong>
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

                {/* <p className="skills">
                  <strong>Skills:</strong>
                  <span className="chips">
                    {jobSeeker.profile?.skills || "N/A"}
                  </span>
                </p> */}
                <p>
                  <strong>Experience:</strong>
                  <span> {jobSeeker.profile?.experience || "N/A"}</span>
                </p>
                <p>
                  <strong>Job Type:</strong>
                  <span>{jobSeeker.profile?.jobtype || "N/A"}</span>
                </p>
              </li>
            ))
          ) : (
            <img src={notfound} alt="No job listings found" />
          )}
        </ul>
      </div>
    </div>
  );
};

export default Candidates;
