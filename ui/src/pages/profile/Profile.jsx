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
  const [formData, setFormData] = useState({}); // For updating profile
  const [message, setMessage] = useState(""); // For success/error messages
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
            },
          }
        );
        setProfileData(response.data);
        localStorage.setItem("profileData", JSON.stringify(response.data)); // Store in local storage
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/auth/profile/${user.id}`, // replace with user's ID
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
          },
        }
      );
      console.log("User ID:", user.id);
      setProfileData(response.data.user);
      localStorage.setItem("profileData", JSON.stringify(response.data.user)); // Update local storage
      setMessage("Profile updated successfully!");
      console.log("Profile updated:", response.data.user);
      setEditMode(false);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  // Delete user profile
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/auth/profile/${profileData.id}`, // replace with user's ID
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
          },
        }
      );
      setMessage(response.data.message);
      localStorage.removeItem("profileData"); // Remove from local storage
      navigate("/register"); // Redirect after deletion
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
          onClick={() => setEditMode(true)} // Enable edit mode
          title="Edit Profile"
        ></i>
        <i
          className="fas fa-trash"
          onClick={handleDelete}
          title="Delete Profile"
        ></i>
      </div>
      {message && <p>{message}</p>} {/* Display message */}
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
                  <p>
                    <strong>Location:</strong> {profileData.profile.location}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {profileData.profile.description}
                  </p>
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
                </>
              ) : null}
            </>
          ) : (
            <div>
              <label>Email:</label>
              <input type="text" value={profileData.email} readOnly />
              <label>Username:</label>
              <input type="text" value={profileData.username} readOnly />
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
