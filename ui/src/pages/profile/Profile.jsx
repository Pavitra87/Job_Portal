import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({}); // For updating profile
  const [message, setMessage] = useState(""); // For success/error messages

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
        `http://localhost:5001/api/auth/profile/${formData.id}`, // replace with user's ID
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
          },
        }
      );
      setProfileData(response.data.user);
      localStorage.setItem("profileData", JSON.stringify(response.data.user)); // Update local storage
      setMessage("Profile updated successfully!");
      console.log("Profile updated:", response.data.user);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  // Delete user profile
  const handleDelete = async () => {
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-actions">
        <i
          className="fas fa-edit"
          onClick={handleUpdate}
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
                <strong>Description:</strong> {profileData.profile.description}
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
                <strong>Experience:</strong> {profileData.profile.experience}
              </p>
            </>
          ) : null}
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default Profile;
