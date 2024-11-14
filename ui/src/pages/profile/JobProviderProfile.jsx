import React, { useState, useEffect } from "react";
import "./jobproviderprofile.css";
import { useAuth } from "../../authenticated/AuthContext";

import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";

const JobProviderProfile = ({
  profileData,
  jobPosts,
  // applicants,
  handleDeleteJob,
  handleUpdateJob,
}) => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [viewingApplicantsForJob, setViewingApplicantsForJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  console.log("Applicants data:", applicants);

  useEffect(() => {
    const fetchApplicants = async (jobId) => {
      try {
        // Retrieve the token from localStorage or other storage method
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          return;
        }

        // Make the request with the Authorization header
        const response = await axios.get(
          `http://localhost:5001/api/jobListing/${jobId}/applicants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle the response
        setApplicants(response.data.applicants || []);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    if (viewingApplicantsForJob) {
      fetchApplicants(viewingApplicantsForJob);
    }
  }, [viewingApplicantsForJob]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    preferredSkills: "",
    education: "",
    experience: "",
    address: "",
    salary_range: "",
  });

  const handleOpenEditModal = (job) => {
    setCurrentJob(job);

    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      preferredSkills: job.preferredSkills,
      education: job.education,
      experience: job.experience,
      address: job.address,
      salary_range: job.salary_range,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentJob(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewApplicants = (job) => {
    setViewingApplicantsForJob(job.id);
  };

  const handleCloseApplicants = () => {
    setViewingApplicantsForJob(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateJob(currentJob.id, formData); // Call to parent function to update the job
    handleCloseEditModal();
  };

  return (
    <div className="provider-container">
      <div className="provider-profile-details">
        <p>
          <strong>Location:</strong>
          <span>{profileData.profile.location}</span>
        </p>
        <p>
          <strong>Description:</strong>
          <span>{profileData.profile.description}</span>
        </p>
        <p>
          <strong>Phone Number:</strong>
          <span>{profileData.profile.phone_number}</span>
        </p>
      </div>

      <div className="provider-posts-job">
        <h2>Your Job Posts</h2>
        {jobPosts.length > 0 ? (
          <div className="provider-posts-job-container">
            <table className="job-details-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Description</th>
                  <th>Requirements</th>
                  <th>Skills</th>
                  <th>Education</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Salary Range</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>View Applicants</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((job) => {
                  return (
                    <>
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>{job.description}</td>
                        <td>{job.requirements}</td>
                        <td>{job.preferredSkills}</td>
                        <td>{job.education}</td>
                        <td>{job.experience}</td>
                        <td>{job.address}</td>
                        <td>{job.salary_range}</td>
                        <td>
                          <i
                            className="fas fa-edit"
                            onClick={() => handleOpenEditModal(job)}
                            title="Edit Job"
                          ></i>
                        </td>
                        <td>
                          <i
                            className="fas fa-trash"
                            onClick={() => {
                              console.log("Job ID:", job.id);
                              handleDeleteJob(job.id);
                            }}
                            title="Delete Job"
                          ></i>
                        </td>
                        <td>
                          <button onClick={() => handleViewApplicants(job)}>
                            View Applicants
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No job posts found.</p>
        )}

        {/* ------------------------------ */}

        {viewingApplicantsForJob && (
          <div>
            <h3>Applicants for Job ID: {viewingApplicantsForJob}</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length > 0 ? (
                  applicants.map((applicant) => (
                    <tr key={applicant.id}>
                      <td>{applicant.seeker?.username || "N/A"}</td>
                      <td>{applicant.seeker?.email || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No applicants found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* -------------------------------------------- */}
      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <div className="arrow-mark">
              <FaArrowLeft onClick={handleCloseEditModal} />
            </div>
            <h3>Edit Job Post</h3>
            <form onSubmit={handleSubmit}>
              <div className="edit-content">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Requirements</label>
                <input
                  type="text"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Skills</label>
                <input
                  type="text"
                  name="preferredSkills"
                  value={formData.preferredSkills}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Location</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-content">
                <label>Salary Range</label>
                <input
                  type="text"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Update Job</button>
              <button type="button" onClick={handleCloseEditModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProviderProfile;
