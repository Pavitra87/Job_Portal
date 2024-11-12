import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authenticated/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applicants, setApplicants] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("User Profile Data:", response.data);
        setProfileData(response.data);
        // localStorage.setItem("profileData", JSON.stringify(response.data));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchJobPostsAndApplicants = async () => {
      try {
        const jobPostsResponse = await axios.get(
          `http://localhost:5001/api/jobListing/jobpost/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setJobPosts(jobPostsResponse.data.jobPosts);

        const applicantPromises = jobPostsResponse.data.jobPosts.map(
          async (job) => {
            const applicantResponse = await axios.get(
              `http://localhost:5001/api/jobListing/applicants/${job.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return { jobId: job.id, applicants: applicantResponse.data };
          }
        );

        const allApplicants = await Promise.all(applicantPromises);
        setApplicants(
          allApplicants.reduce((acc, { jobId, applicants }) => {
            acc[jobId] = applicants;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching job posts or applicants:", error);
        // handleError("Error loading job posts or applicants.");
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/jobApplications/getapply/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAppliedJobs(response.data);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      }
    };

    fetchJobPostsAndApplicants();
    fetchAppliedJobs();
    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/auth/profile/${user.id}`,
        formData,
        {
          headers: {
            Authorization: ` Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Merge updated data into profileData
      setProfileData((prevProfileData) => ({
        ...prevProfileData,
        profile: { ...prevProfileData.profile, ...formData },
      }));

      // localStorage.setItem("profileData", JSON.stringify(response.data.user));
      setMessage("Profile updated successfully!");

      // Exit edit mode and clear success message after a delay
      setEditMode(false);
      setTimeout(() => setMessage(""), 1000);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/auth/profile/${profileData.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message);
      localStorage.removeItem("profileData");
      navigate("/register");
    } catch (error) {
      setMessage("Error deleting profile. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job post?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5001/api/jobListing/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobPosts((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      setMessage("Job post deleted successfully!");
    } catch (error) {
      console.error("Error deleting job post:", error);
      setMessage("Error deleting job post. Please try again.");
    }
  };
  const handleEditJob = (job) => {
    // Load job details into form data and enter edit mode
    setFormData(job);
    setEditMode(true);
  };
  const handleJobUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/jobListing/${formData.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setJobPosts((prevJobs) =>
        prevJobs.map((job) => (job.id === formData.id ? response.data : job))
      );
      setMessage("Job updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating job:", error);
      setMessage("Error updating job. Please try again.");
    }
  };

  const handleDeleteAppliedJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5001/api/jobApplications/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError("Failed to delete the application");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-actions">
        <i
          className="fas fa-edit"
          onClick={() => setEditMode(true)}
          title="Edit Profile"
        ></i>
        <i
          className="fas fa-trash"
          onClick={handleDelete}
          title="Delete Profile"
        ></i>
      </div>
      {message && <p>{message}</p>}
      {profileData ? (
        <div className="profile-details">
          {!editMode ? (
            <>
              <div className="profile-user-details">
                <div className="user-details">
                  <h3>{profileData.username}</h3>
                  <p>
                    <strong>Email:</strong> <span>{profileData.email}</span>
                  </p>
                </div>
                <div>
                  <img src="" alt="Profile picture" />
                </div>
              </div>
              <div>
                {profileData.role === "Job Provider" ? (
                  <div className="provider-container">
                    <div className="provider-profile-details">
                      <p>
                        <strong>Location:</strong>
                        <span>{profileData.profile.location}</span>
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        <span> {profileData.profile.description}</span>
                      </p>
                      <p>
                        <strong>Phone Number</strong>
                        <span>{profileData.profile.phone_number}</span>
                      </p>
                    </div>
                    <div className="provider-posts-job">
                      <h2>Your Job Posts</h2>
                      {jobPosts.length > 0 ? (
                        <div className="provider-posts-job-container">
                          <div className="job-item">
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
                                </tr>
                              </thead>
                              <tbody>
                                {jobPosts.map((job) => (
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
                                        onClick={() => handleEditJob(job)}
                                        title="Edit Job"
                                      ></i>
                                    </td>
                                    <td>
                                      <i
                                        className="fas fa-trash"
                                        onClick={() => handleDeleteJob(job.id)}
                                        title="Delete Job"
                                      ></i>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="job-applicants">
                              <h4>Applicants:</h4>
                              {applicants?.length > 0 ? (
                                applicants.map((applicant) => (
                                  <div
                                    key={applicant.id}
                                    className="applicant-item"
                                  >
                                    <p>
                                      <strong>Username:</strong>{" "}
                                      {applicant.user.username}
                                    </p>
                                    <p>
                                      <strong>Skills:</strong>{" "}
                                      {applicant.user.profile.skills}
                                    </p>
                                    <p>
                                      <strong>Education:</strong>{" "}
                                      {applicant.user.profile.education}
                                    </p>
                                    <p>
                                      <strong>Experience:</strong>{" "}
                                      {applicant.user.profile.experience}
                                    </p>
                                    <p>
                                      <strong>Phone:</strong>{" "}
                                      {applicant.user.profile.phone_number}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p>No applicants yet.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>No job posts found.</p>
                      )}
                    </div>
                  </div>
                ) : profileData.role === "Job Seeker" ? (
                  <div className="seeker-container">
                    <div className="seeker-profile-details">
                      <p>
                        <strong>Skills:</strong>
                        <span>{profileData.profile?.skills}</span>
                      </p>
                      <p>
                        <strong>Job Title:</strong>
                        <span>{profileData.profile?.jobtitle}</span>
                      </p>
                      <p>
                        <strong>Education:</strong>{" "}
                        <span>{profileData.profile?.education}</span>
                      </p>
                      <p>
                        <strong>Phone Number:</strong>{" "}
                        <span>{profileData.profile?.phone_number}</span>
                      </p>
                      <p>
                        <strong>Experience:</strong>{" "}
                        <span>{profileData.profile?.experience}</span>
                      </p>
                      <p>
                        <strong>Address:</strong>
                        <span>{profileData.profile?.location}</span>
                      </p>
                      <p>
                        <strong>Job Type:</strong>
                        <span>{profileData.profile?.jobtype}</span>
                      </p>
                    </div>
                    <div className="seeker-applied-job">
                      <h2>Applied Jobs</h2>
                      {appliedJobs.length > 0 ? (
                        <ul>
                          {appliedJobs.map((job) => (
                            <li key={job.id}>
                              <h3>{job.jobListing.title}</h3>
                              <p>{job.jobListing.description}</p>
                              <p>
                                <strong>Location:</strong>{" "}
                                {job.jobListing.location}
                              </p>
                              <p>
                                <strong>Salary Range:</strong>{" "}
                                {job.jobListing.salary_range}
                              </p>
                              <i
                                className="fas fa-trash"
                                onClick={() => handleDeleteAppliedJob(job.id)}
                                title="Delete Application"
                              ></i>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No job applications found.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            // -----------------update--------------------
            <div className="update-profiles">
              <div className="update-profile-contents">
                <label>Email:</label>
                <input type="text" value={profileData.email} readOnly />
                <label>Username:</label>
                <input type="text" value={profileData.username} readOnly />
              </div>
              <div className="update-profile-container">
                {profileData.role === "Job Provider" ? (
                  <div className="update-provider-details">
                    <label>Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleChange}
                    />
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                    />

                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleChange}
                    />
                  </div>
                ) : profileData.role === "Job Seeker" ? (
                  <div className="update-seeker-details">
                    <label htmlFor="">Job Title:</label>
                    <input
                      type="text"
                      name="jobtitle"
                      value={formData.jobtitle || ""}
                      onChange={handleChange}
                    />
                    <label>Skills:</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills || ""}
                      onChange={handleChange}
                    />

                    <label>Education:</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education || ""}
                      onChange={handleChange}
                    />
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleChange}
                    />
                    <label>Experience:</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience || ""}
                      onChange={handleChange}
                    />
                    <label htmlFor="">Address:</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleChange}
                    />

                    <label htmlFor="">Job Type</label>
                    <input
                      type="text"
                      name="jobtype"
                      value={formData.jobtype || ""}
                    />
                  </div>
                ) : null}
              </div>
              <button onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          )}
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default Profile;
