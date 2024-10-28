import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Category from "./pages/category/Category";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    // Clear user information
    setUser(null);
    // Additional logout logic, e.g., removing JWT token from storage
    localStorage.removeItem("token"); // Optional: if you're storing a token in localStorage
  };
  return (
    <div>
      <BrowserRouter>
        <Header>
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout}>Logout</button>
              {user.roleName === "Job Provider" ? (
                <Link to="/post-job">Post Job</Link>
              ) : (
                <Link to="/wants-job">Wants Job</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
