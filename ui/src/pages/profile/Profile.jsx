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
        localStorage.setItem("profileData", JSON.stringify(response.data));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    const fetchJobPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/jobListing/jobpost`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setJobPosts(response.data.jobPosts);
      } catch (err) {
        console.error("Error fetching job posts:", err);
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/jobApplications/getapply`,
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
    fetchAppliedJobs();
    fetchProfile();
  }, []);
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

      localStorage.setItem("profileData", JSON.stringify(response.data.user));
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
              <p>
                <strong>Email:</strong> {profileData.email}
              </p>
              <p>
                <strong>Username:</strong> {profileData.username}
              </p>

              {profileData.role === "Job Provider" ? (
                <>
                  <div>
                    <p>
                      <strong>Location:</strong> {profileData.profile.location}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {profileData.profile.description}
                    </p>
                  </div>
                  <h2>Your Job Posts</h2>
                  {jobPosts.length > 0 ? (
                    <ul>
                      {jobPosts.map((job) => (
                        <li key={job.id}>
                          <h3>{job.title}</h3>
                          <p>{job.description}</p>
                          <p>
                            <strong>Location:</strong> {job.location}
                          </p>
                          <p>
                            <strong>Salary Range:</strong> {job.salary_range}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No job posts found.</p>
                  )}
                </>
              ) : profileData.role === "Job Seeker" ? (
                <>
                  <p>
                    <strong>Skills:</strong> {profileData.profile.skills}
                  </p>
                  <p>
                    <strong>Education:</strong> {profileData.profile.education}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {profileData.profile.phone_number}
                  </p>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {profileData.profile.experience}
                  </p>

                  <h2>Applied Jobs</h2>
                  {appliedJobs.length > 0 ? (
                    <ul>
                      {appliedJobs.map((job) => (
                        <li key={job.id}>
                          <h3>{job.jobListing.title}</h3>
                          <p>{job.jobListing.description}</p>
                          <p>
                            <strong>Location:</strong> {job.jobListing.location}
                          </p>
                          <p>
                            <strong>Salary Range:</strong>{" "}
                            {job.jobListing.salary_range}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No job applications found.</p>
                  )}
                </>
              ) : null}
            </>
          ) : (
            <div className="profile-contents">
              <label>Email:</label>
              <input type="text" value={profileData.email} readOnly />
              <label>Username:</label>
              <input type="text" value={profileData.username} readOnly />

              {profileData.role === "Job Provider" ? (
                <>
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                  />
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                  />
                </>
              ) : profileData.role === "Job Seeker" ? (
                <>
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
                </>
              ) : null}

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
