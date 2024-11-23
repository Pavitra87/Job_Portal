import React, { useState, useEffect } from "react";
import "./jobproviderprofile.css";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import Table from "../../components/Table/Table";

const JobProviderProfile = ({
  profileData,
  jobPosts,

  handleDeleteJob,
  handleUpdateJob,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth > 1100);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [viewingApplicantsForJob, setViewingApplicantsForJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
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
  useEffect(() => {
    const fetchApplicants = async (jobId) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          return;
        }

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

  const handleViewApplicants = (job) => {
    setViewingApplicantsForJob(job.id);
    setCurrentJob(job);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1100);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check when the component mounts
    handleResize();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSmallScreen]);

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
          <span>{profileData.profile?.location}</span>
        </p>
        <p>
          <strong>Description:</strong>
          <span>{profileData.profile?.description}</span>
        </p>
        <p>
          <strong>Contact No:</strong>
          <span>{profileData.profile?.phone_number}</span>
        </p>
      </div>

      <div className="provider-posts-job">
        <div className="post-title">
          <h2>Your Job Posts</h2>
          <span className="underline"></span>
        </div>
        {jobPosts.length > 0 ? (
          <div className="provider-posts-job-container">
            {!isSmallScreen ? (
              <table className="job-details-table">
                <thead>
                  <tr>
                    <th>id</th>
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
                <tbody style={{ textTransform: "capitalize" }}>
                  {jobPosts.map((job, index) => {
                    return (
                      <>
                        <tr key={job.id}>
                          <td>{index + 1}</td>
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
                              style={{ color: "#0052b0", cursor: "pointer" }}
                            ></i>
                          </td>
                          <td>
                            <i
                              className="fas fa-trash"
                              style={{ color: "#0052b0", cursor: "pointer" }}
                              onClick={() => {
                                console.log("Job ID:", job.id);
                                handleDeleteJob(job.id);
                              }}
                              title="Delete Job"
                            ></i>
                          </td>
                          <td>
                            <button
                              onClick={() => handleViewApplicants(job)}
                              style={{ color: "#0052b0", cursor: "pointer" }}
                            >
                              View Applicants
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Table
                data={jobPosts}
                type={"job post"}
                handleDeleteJob={handleDeleteJob}
                handleOpenEditModal={handleOpenEditModal}
                handleViewApplicants={handleViewApplicants}
              />
            )}
          </div>
        ) : (
          <p>No job posts found.</p>
        )}

        {/* --------------getapplicants---------------- */}

        {viewingApplicantsForJob && currentJob && (
          <div className="applicats-model">
            <div className="applicant-model-content">
              <span>
                {" "}
                <RxCross2 onClick={handleCloseApplicants} />
              </span>
              <div className="applicants-heading">
                <h3
                  style={{
                    fontSize: "27px",
                    textTransform: "capitalize",
                    color: "#000",
                  }}
                >
                  Job Title: {currentJob.title || "Unknown Job Title"}
                </h3>
              </div>
              <>
                <h4>Applicants Deatails</h4>
                {!isSmallScreen ? (
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact No</th>
                        <th>Skills</th>
                        <th>Education</th>
                        <th>Experience</th>
                        <th>Location</th>
                        <th>Job Type</th>
                        <th>Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.length > 0 ? (
                        applicants.map((applicant, index) => (
                          <tr key={applicant.id}>
                            <td>{index + 1}</td>
                            <td>{applicant.seeker?.username || "N/A"}</td>
                            <td>{applicant.seeker?.email || "N/A"}</td>
                            <td>
                              {applicant.seeker?.profile?.phone_number || "N/A"}
                            </td>
                            <td>
                              {applicant.seeker?.profile?.skills || "N/A"}
                            </td>
                            <td>
                              {applicant.seeker?.profile?.education || "N/A"}
                            </td>
                            <td>
                              {applicant.seeker?.profile?.experience || "N/A"}
                            </td>
                            <td>
                              {applicant.seeker?.profile?.location || "N/A"}
                            </td>
                            <td>
                              {applicant.seeker?.profile?.jobtype || "N/A"}
                            </td>
                            <td>
                              {applicant.seeker?.profile?.resume ? (
                                <>
                                  {/* {console.log(
                              "Resume applicants path:",
                              applicant.seeker.profile.resume
                            )} */}
                                  <a
                                    href={`http://localhost:5001/${applicant.seeker.profile.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Resume
                                  </a>
                                </>
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2">No applicants found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <Table data={applicants} />
                )}
              </>
            </div>
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
