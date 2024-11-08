import React, { useEffect, useState } from "react";
import axios from "axios";
import "./alljob.css";
import notfound from "../../assets/notfound.png";
import { useAuth } from "../../authenticated/AuthContext";

const AllJobs = () => {
  const { user } = useAuth();
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    title: "",
    preferredSkills: "",
    location: "",
    salary_range: "",
  });

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5001/api/jobListing/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(localStorage.getItem("token"));
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
        { jobId, seekerId }, // Send jobId and seekerId
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
    const { title, preferredSkills, location, salary_range } = filters;

    const matchTitle = title
      ? job.title.toLowerCase().includes(title.toLowerCase())
      : true;

    const matchPreferredSkills = preferredSkills
      ? job.preferredSkills
          .toLowerCase()
          .includes(preferredSkills.toLowerCase())
      : true;

    const matchLocation = location
      ? job.location.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchSalary = salary_range
      ? job.salary_range.toLowerCase().includes(salary_range.toLowerCase())
      : true;

    return matchTitle || matchPreferredSkills || matchLocation || matchSalary;
  });

  if (loading) return <p>Loading job listings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <div className="job-list-container">
        <h2>Job Listings</h2>
        <div className="job-contain">
          <div className="filter-form-jobs">
            <h3>Find Your Job</h3>
            <input
              type="text"
              placeholder="Filter Title"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Filter Preferred Skills"
              value={filters.preferredSkills}
              onChange={(e) =>
                setFilters({ ...filters, preferredSkills: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Filter Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Filter Salary"
              value={filters.salary_range}
              onChange={(e) =>
                setFilters({ ...filters, salary_range: e.target.value })
              }
            />
          </div>

          <ul>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <li key={job.id} className="job-list-item">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(job.preferredSkills)
                      ? job.preferredSkills.join(", ")
                      : job.preferredSkills &&
                        typeof job.preferredSkills === "object"
                      ? Object.values(job.preferredSkills).join(", ") // If it's an object, convert values to a string
                      : "No skills listed"}
                  </p>
                  <p>
                    <strong>Salary Range:</strong> {job.salary_range}
                  </p>
                  <p>
                    <strong>Posted At:</strong>{" "}
                    {new Date(job.posted_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Expires At:</strong>{" "}
                    {new Date(job.expires_at).toLocaleDateString()}
                  </p>
                  <button onClick={() => applyForJob(job.id)}>
                    Apply for job
                  </button>
                </li>
              ))
            ) : (
              <img src={notfound} alt="No job listings found" />
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AllJobs;
