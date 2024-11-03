import React, { useEffect, useState } from "react";
import axios from "axios";
import "./alljob.css";

const AllJobs = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        // Retrieve the token from local storage
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

  if (loading) return <p>Loading job listings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <div className="job-list-container">
        <h2>Job Listings</h2>
        <ul>
          {jobListings.map((job) => (
            <li key={job.id} className="job-list-item">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>
                <strong>Location:</strong> {job.location}
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
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AllJobs;
