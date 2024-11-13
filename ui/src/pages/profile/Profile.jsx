import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authenticated/AuthContext";
import JobProviderProfile from "./JobProviderProfile";
import JobSeekerProfile from "./JobSeekerProfile";

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

    const fetchJobPosts = async () => {
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

    const fetchApplications = async () => {
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

    fetchJobPosts();
    // fetchAppliedJobs();
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
      navigate("/");
    } catch (error) {
      setMessage("Error deleting profile. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      // Send DELETE request to the API
      const response = await axios.delete(
        `http://localhost:5001/api/jobListing/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT Token for authorization
          },
        }
      );

      if (response.status === 200) {
        // If deletion is successful, filter out the deleted job from the job posts state
        setJobPosts((prevJobPosts) =>
          prevJobPosts.filter((job) => job.id !== jobId)
        );
        alert("Job listing deleted successfully!");
      }
    } catch (error) {
      // Detailed error handling for better feedback
      console.error(
        "Error deleting job post:",
        error.response?.data || error.message
      );

      if (error.response && error.response.data) {
        alert(
          `Error: ${
            error.response.data.error || "Failed to delete job listing."
          }`
        );
      } else {
        alert("Failed to delete job listing. Please try again later.");
      }
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
                  <JobProviderProfile
                    profileData={profileData}
                    jobPosts={jobPosts}
                    applicants={applicants}
                    handleEditJob={handleEditJob}
                    handleDeleteJob={handleDeleteJob}
                  />
                ) : profileData.role === "Job Seeker" ? (
                  <JobSeekerProfile
                    profileData={profileData}
                    appliedJobs={appliedJobs}
                    handleDeleteAppliedJob={handleDeleteAppliedJob}
                  />
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
                      value={formData.location}
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
