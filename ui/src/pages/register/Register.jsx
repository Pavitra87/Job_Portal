import React, { useState } from "react";
import axios from "axios";
import "./register.css";
import { Link } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    profile_picture_url: null,
    username: "",
    email: "",
    password: "",
    roleName: "Job Seeker",
  });

  const [message, setMessage] = useState("");
  const [profilePreview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        profile_picture_url: file,
      }));
      setPreview(imageUrl);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("profile_picture_url", formData.profile_picture_url);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("roleName", formData.roleName);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        data
      );

      setFormData({
        email: "",
        username: "",
        password: "",
        roleName: "Job Seeker",
        profile_picture_url: null,
      });
      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage("Error registering user. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input
          id="profileInput"
          type="file"
          name="profile_picture_url"
          // value={formData.profile_picture_url}
          onChange={handleFileChange}
          accept="image/*"
          className="profile"
        />
        <label className="upload-label" htmlFor="profileInput">
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile Preview"
              className="profile-preview"
            />
          ) : (
            <div className="default-avatar">+</div>
          )}
        </label>

        <input
          type="text"
          name="username"
          placeholder="Enter your Name"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className="password-toggle-icon"
          />
        </div>
        <select
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          required
        >
          <option value="Job Seeker">Job Seeker</option>
          <option value="Job Provider">Job Provider</option>
        </select>

        <button type="submit">Register</button>

        <div className="account-links">
          <p className="text">
            Already have an account? &nbsp;
            <span>
              <Link className="login-link" to="/login">
                LogIn
              </Link>
            </span>
          </p>
        </div>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
