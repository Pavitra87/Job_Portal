import React, { useState } from "react";
import axios from "axios";
import "./register.css";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Job Seeker",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/register",
        formData
      );
      setMessage(response.data.message);
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
          type="text"
          name="name"
          placeholder="Enter your Name"
          value={formData.name}
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
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
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
