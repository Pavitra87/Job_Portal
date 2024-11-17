import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authenticated/AuthContext";
import JobProviderProfile from "./JobProviderProfile";
import JobSeekerProfile from "./JobSeekerProfile";
import { FaArrowLeft } from "react-icons/fa6";

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
      } catch (error) {
        console.error("Error fetching job posts:", error);
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

    fetchApplications();
    fetchJobPosts();

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
    navigate("/");
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete your profile? This action cannot be undone."
    // );
    // if (!confirmDelete) return;
    // try {
    //   const response = await axios.delete(
    //     `http://localhost:5001/api/auth/profile/${profileData.id}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   setMessage(response.data.message);
    //   localStorage.removeItem("profileData");
    //   navigate("/");
    // } catch (error) {
    //   setMessage("Error deleting profile. Please try again.");
    //   console.error("Delete error:", error);
    // }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage

      if (!token) {
        alert("You need to log in to delete a job.");
        return;
      }

      // Make the DELETE request
      const response = await axios.delete(
        `http://localhost:5001/api/jobListing/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT Token for authorization
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        setJobPosts((prevJobs) => prevJobs.filter((job) => job.id !== jobId)); // Update state to remove the deleted job
        alert("Job listing deleted successfully.");
      } else {
        setError("Failed to delete job listing. Please try again.");
        alert("Failed to delete job listing. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setError("Failed to delete job listing.");
      alert("Failed to delete job listing. Please try again later.");
    }
  };

  const handleEditJob = (job) => {
    // Load job details into form data and enter edit mode
    setFormData(job);
    setEditMode(true);
  };

  const handleUpdateJob = async (jobId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/jobListing/${jobId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Update the jobPosts state after a successful update
      setJobPosts((prevJobPosts) =>
        prevJobPosts.map((job) =>
          job.id === jobId ? { ...job, ...updatedData } : job
        )
      );
      alert("Job updated successfully!");
      // setMessage("Job updated successfully!");
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

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      resume: e.target.files[0], // Handle the file selected
    }));
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div
        style={{
          border: "1px solid #ccc",
          padding: "14px",
          borderRadius: "5px",
        }}
      >
        <div className="my-profile">
          <h1>My Profile</h1>
          <span className="underline"></span>
        </div>
        <div className="container">
          <div className="profile-actions">
            <i
              className="fas fa-edit"
              onClick={() => setEditMode(true)}
              title="Edit Profile"
            ></i>
            <button onClick={handleDelete} style={{ padding: "3px 8px" }}>
              back
            </button>
          </div>
          {message && <p>{message}</p>}
          {profileData ? (
            <div className="profile-details">
              {!editMode ? (
                <div className="profiles">
                  <div className="profile-user-details">
                    <div className="profile-img">
                      <img
                        src={`http://localhost:5001/${profileData.profile_picture_url}`}
                        alt={profileData.name}
                      />
                    </div>
                    <div className="user-details">
                      <h3>{profileData.username}</h3>
                      <p>{profileData.email}</p>
                    </div>
                  </div>
                  <div>
                    {profileData.role === "Job Provider" ? (
                      <JobProviderProfile
                        profileData={profileData}
                        jobPosts={jobPosts}
                        handleEditJob={handleEditJob}
                        handleUpdateJob={handleUpdateJob}
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
                </div>
              ) : (
                // -----------------update--------------------
                <div className="update-profiles">
                  <div className="back-arrow-mark">
                    <FaArrowLeft onClick={() => setEditMode(false)} />
                  </div>
                  <h3>Edit Profile</h3>
                  <div className="update-profile-contents">
                    <img src={profileData.profile_picture_url} alt="" />
                    <label>Email:</label>
                    <input type="text" value={profileData.email} readOnly />
                    <label>Username:</label>
                    <input type="text" value={profileData.username} />
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
                        <label htmlFor="">Resume</label>
                        <input
                          type="file"
                          name="resume"
                          accept="application/pdf" // Restrict file types to PDF (optional)
                          onChange={handleFileChange} // Handle file input change
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
      </div>
    </div>
  );
};

export default Profile;
