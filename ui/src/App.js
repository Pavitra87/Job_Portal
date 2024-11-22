import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";

import Register from "./pages/register/Register";
import Login from "./pages/login/Login";

import CreateJobApplication from "./pages/provider/CreateJobApplication";
import AllJobs from "./pages/provider/AllJobs";
import Candidates from "./pages/candidate/Candidates";
import Profile from "./pages/profile/Profile";
import { AuthProvider } from "./authenticated/AuthContext";
import Category from "./pages/category/Category";
import JobSeeker from "./pages/profile/JobSeeker";
import JobProvider from "./pages/profile/JobProvider";

function App() {
  const [refreshHeader, setRefreshHeader] = useState(false);

  const refreshProfile = () => {
    setRefreshHeader(!refreshHeader);
  };
  return (
    <div>
      <Header key={refreshHeader} refreshProfile={refreshProfile} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category" element={<Category />} />
        <Route path="/seeker" element={<JobSeeker />} />
        <Route path="/provider" element={<JobProvider />} />
        <Route path="/post-job" element={<CreateJobApplication />} />
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/candidate-list" element={<Candidates />} />
        <Route path="/userprofile" element={<Profile />} />

        {/* ----------------job seeker--------------- */}
      </Routes>
    </div>
  );
}

export default App;
