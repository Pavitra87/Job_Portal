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
  const [profileComplete, setProfileComplete] = useState(false);

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

        // Check if profile is complete based on certain fields
        const isComplete = checkProfileCompleteness(response.data);
        setProfileComplete(isComplete);
        localStorage.setItem("profileComplete", isComplete);
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

  const checkProfileCompleteness = (profileData) => {
    // Check if the necessary fields are filled to determine profile completeness
    const requiredFields = [
      profileData.location,
      profileData.phone_number,
      profileData.description,
      // Add other required fields as necessary
    ];
    return requiredFields.every((field) => field && field.trim() !== "");
  };

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

      // Check for completeness after update
      const isComplete = checkProfileCompleteness(response.data);
      setProfileComplete(isComplete);
      localStorage.setItem("profileComplete", isComplete);

      setMessage("Profile updated successfully!");
      setEditMode(false);
      setTimeout(() => setMessage(""), 1000);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    navigate("/");
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
            Authorization: `Bearer ${token}`,
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <h1>
        User Profile <span className="underline"></span>
      </h1>
      <div className="container">
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
              <div className="profiles">
                <div className="profile-user-details">
                  <div className="user-details">
                    <h3>{profileData.username}</h3>
                    <p>
                      <strong>Email:</strong> <span>{profileData.email}</span>
                    </p>
                    <p>
                      <strong>Profile Status:</strong>
                      {profileComplete ? "Complete" : "Incomplete"}
                    </p>
                  </div>
                  <div>
                    <img
                      src={`http://localhost:5001/${profileData.profile_picture_url}`}
                      alt={profileData.name}
                    />
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
                <img src="" alt="" />
              </div>
            ) : (
              <div className="update-profiles">
                <div className="back-arrow-mark">
                  <FaArrowLeft onClick={() => setEditMode(false)} />
                </div>
                <h3>Edit Profile</h3>
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
                      <label>Phone Number:</label>
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number || ""}
                        onChange={handleChange}
                      />
                      <label>Bio:</label>
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                      />
                    </div>
                  ) : null}
                </div>
                <button onClick={handleUpdate}>Update</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
