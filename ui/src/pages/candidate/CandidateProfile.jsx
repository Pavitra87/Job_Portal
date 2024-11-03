import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CandidateProfile = () => {
  const { id } = useParams(); // Get the ID from the URL parameters
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const token = localStorage.getItem("token"); // Or however you store your token

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Fetching profile with ID:", id); // Log the ID
      const token = localStorage.getItem("token"); // Assuming the token is stored in local storage
      try {
        const response = await axios.get(
          `http://localhost:5001/api/jobSeeker/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the header
            },
          }
        );
        console.log("Profile data received:", response.data); // Log the received profile data
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error); // Log any errors
        setProfile(null); // Explicitly set profile to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Profile not found.</p>;
  return (
    <div>
      <h1>
        {profile.first_name} {profile.last_name}
      </h1>
      <p>Phone: {profile.phone_number}</p>
      <p>Skills: {profile.skills.join(", ")}</p>
      <p>Experience: {profile.experience}</p>
      <p>Education: {profile.education}</p>
      <p>Location: {profile.location}</p>
      <p>Preferred Job Types: {profile.preferredJobTypes.join(", ")}</p>
    </div>
  );
};

export default CandidateProfile;
