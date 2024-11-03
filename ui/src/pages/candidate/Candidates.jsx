import React, { useEffect, useState } from "react";
import axios from "axios";
import "./candidatelist.css";
import notfound from "../../assets/notfound.png";
const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    education: "",
    experience: "",
    skills: "",
    location: "",
    jobType: "",
  });
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // const token = localStorage.getItem("token"); // Assuming you're storing the token in localStorage
        const response = await axios.get(
          "http://localhost:5001/api/jobSeeker/"
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        );
        setCandidates(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.error : "Error fetching candidates"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const { education, experience, skills, jobType } = filters;

    // Filter conditions
    const matchesEducation = education
      ? candidate.education.toLowerCase().includes(education.toLowerCase())
      : true;
    const matchesExperience = experience
      ? candidate.experience.toLowerCase().includes(experience.toLowerCase())
      : true;
    const matchesSkills = skills
      ? candidate.skills.toLowerCase().includes(skills.toLowerCase())
      : true;

    const matchesJobType = jobType
      ? candidate.preferredJobTypes
          .toLowerCase()
          .includes(jobType.toLowerCase())
      : true;

    return (
      matchesEducation || matchesExperience || matchesSkills || matchesJobType
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="candidate-list">
      <h2>Candidates List</h2>

      <div className="filter-form">
        <input
          type="text"
          placeholder="Filter by Education"
          value={filters.education}
          onChange={(e) =>
            setFilters({ ...filters, education: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Filter by Experience"
          value={filters.experience}
          onChange={(e) =>
            setFilters({ ...filters, experience: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Filter by Skills"
          value={filters.skills}
          onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
        />

        <input
          type="text"
          placeholder="Filter by Job Type"
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
        />
      </div>
      <div className="candidate-details">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="details">
              <h4>
                {candidate.first_name} {candidate.last_name}
              </h4>
              <p>
                <span>Mobile No:</span> {candidate.phone_number}
              </p>
              <p>
                <span>Skills:</span> {candidate.skills}
              </p>
              <p>
                <span>Experience:</span> {candidate.experience}
              </p>
              <p>
                <span>Education:</span> {candidate.education}
              </p>
              <p>
                <span>Location:</span> {candidate.location}
              </p>
              <p>
                <span>Resume:</span> {candidate.resume_url}
              </p>
              <p>
                <span>Job Type:</span> {candidate.preferredJobTypes}
              </p>
            </div>
          ))
        ) : (
          <img src={notfound} alt="not found" />
        )}
      </div>
    </div>
  );
};

export default Candidates;
