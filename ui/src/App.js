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

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ---------------job provider------------ */}

          <Route path="/post-job" element={<CreateJobApplication />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/candidate-list" element={<Candidates />} />
          <Route path="/userprofile" element={<Profile />} />

          {/* ----------------job seeker--------------- */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
