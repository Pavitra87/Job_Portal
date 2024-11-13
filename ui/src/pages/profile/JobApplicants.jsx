import React, { useState, useEffect } from "react";
import axios from "axios";

const JobApplicants = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applicants when the component mounts
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/jobListing/${jobId}/applicants`, // Replace with your API endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is in localStorage
            },
          }
        );
        setApplicants(response.data.applicants);
      } catch (err) {
        setError("Failed to fetch applicants");
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div className="job-applicants">
      <h4>Applicants for Job ID: {jobId}</h4>
      {loading ? (
        <p>Loading applicants...</p>
      ) : error ? (
        <p>{error}</p>
      ) : applicants.length > 0 ? (
        <ul>
          {applicants.map((applicant) => (
            <li key={applicant.id}>
              <strong>{applicant.username}</strong> - {applicant.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No applicants yet.</p>
      )}
    </div>
  );
};

export default JobApplicants;
