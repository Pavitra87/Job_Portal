import React, { useEffect, useState } from "react";
import axios from "axios";
import "./candidate.css";
import notfound from "../../assets/notfound.png";

const Candidates = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    skills: "",
    education: "",
    jobtitle: "",
    experience: "",
  });

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/auth/profiles",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the JWT token in localStorage
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
      ? candidate.profile.skills &&
        candidate.profile.skills.toLowerCase().includes(skills.toLowerCase())
      : true;

    const matcheducation = education
      ? candidate.profile.education &&
        candidate.profile.education
          .toLowerCase()
          .includes(education.toLowerCase())
      : true;

    const matchjobtitle = jobtitle
      ? candidate.profile.jobtitle &&
        candidate.profile.jobtitle
          .toLowerCase()
          .includes(jobtitle.toLowerCase())
      : true;

    const matchexperience = experience
      ? candidate.profile.experience &&
        candidate.profile.experience
          .toLowerCase()
          .includes(experience.toLowerCase())
      : true;

    return matcheducation || matchskills || matchexperience || matchjobtitle;
  });

  if (loading) return <p>Loading job seekers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="candidates-container">
      <h2>Job Seeker Profiles</h2>.
      <div className="filter-contains-candidate">
        <div className="filter-form">
          <h4>Find Candidates</h4>
          <input
            type="text"
            placeholder="Filter job Title"
            value={filters.jobtitle}
            onChange={(e) =>
              setFilters({ ...filters, jobtitle: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Filter  Skills"
            value={filters.skills}
            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter education"
            value={filters.education}
            onChange={(e) =>
              setFilters({ ...filters, education: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Filter experience"
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
          />
        </div>
        <ul className="candidate-details">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((jobSeeker) => (
              <li key={jobSeeker.id}>
                <h3>{jobSeeker.username}</h3>
                <p>
                  <strong>Email: </strong>
                  {jobSeeker.email}
                </p>
                <p>
                  <strong>Education:</strong> {jobSeeker.profile.education}
                </p>
                <p>
                  <strong>Location:</strong> {jobSeeker.profile.location}
                </p>
                <p>
                  <strong>Phone Number:</strong>{" "}
                  {jobSeeker.profile.phone_number}
                </p>
                <p>
                  <strong>Job Title:</strong> {jobSeeker.profile.jobtitle}
                </p>
                <p>
                  <strong>Description:</strong> {jobSeeker.profile.description}
                </p>
                <p>
                  <strong>Skills:</strong> {jobSeeker.profile.skills}
                </p>
                <p>
                  <strong>Experience:</strong> {jobSeeker.profile.experience}
                </p>
                <p>
                  <strong>Resume:</strong> {jobSeeker.profile.resume}
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
