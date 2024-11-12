import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authenticated/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );

      const { token, user, message, profile_picture_url } = response.data;
      console.log("token from response:", response.data.token);
      const userRole = user.role;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", userRole);
        localStorage.setItem("profilepicture", profile_picture_url);

        setSuccess("Login successful!");
        setMessage(message);

        login(user);
        navigate("/");
        setMessage(message || "Login successful!");
      } else {
        console.error("No token received in the response.");
      }
    } catch (error) {
      setMessage("Error logging in. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="password-input-containers">
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
            className="password-toggle-icons"
          />
        </div>

        <button type="submit">Login</button>
        <div className="account-links">
          <p className="text">
            Don't have an account?
            <span>
              <Link className="register-link" to="/register">
                Register
              </Link>
            </span>
          </p>
        </div>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
