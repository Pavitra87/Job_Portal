import React, { useEffect, useState } from "react";
import "./jobseekerprofile.css";
import Table from "../../components/Table/Table";
import { useTranslation } from "react-i18next";

const JobSeekerProfile = ({
  profileData,
  appliedJobs,
  handleDeleteAppliedJob,
}) => {
  const { t } = useTranslation();
  const resumeUrl = profileData.profile?.resume
    ? `http://localhost:5001/${profileData.profile.resume}`
    : null;

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth > 1100);

  useEffect(() => {
    const handleResize = () => {
      // Check if window width is less than 1100px
      setIsSmallScreen(window.innerWidth < 1100);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check when the component mounts
    handleResize();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSmallScreen]);

  return (
    <div className="seeker-container">
      <div className="seeker-profile-details">
        <div>
          <p>
            <strong>Job Title:</strong>
            <span>{profileData.profile?.jobtitle}</span>
          </p>

          <p>
            <strong>Education:</strong>
            <span>{profileData.profile?.education}</span>
          </p>
          <p>
            <strong>Contact No:</strong>
            <span>{profileData.profile?.phone_number}</span>
          </p>
          <p>
            <strong>Experience:</strong>
            <span>{profileData.profile?.experience}</span>
          </p>

          <p>
            <strong>Address:</strong>
            <span>{profileData.profile?.location}</span>
          </p>
          <p>
            <strong>Job Type:</strong>
            <span>{profileData.profile?.jobtype}</span>
          </p>
        </div>
        <div>
          <p className="skills">
            <strong>Skills:</strong>
            <span className="chips">
              {profileData.profile?.skills
                ? profileData.profile?.skills.split(",").map((skill, index) => (
                    <span key={index} className="chip">
                      {skill.trim()}
                    </span>
                  ))
                : "N/A"}
            </span>
          </p>
          <p className="resume">
            <strong>Resume:</strong>
            {profileData.profile?.resume ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
              >
                View Resume
              </a>
            ) : (
              "No resume uploaded"
            )}
          </p>
        </div>
      </div>

      <div className="seeker-applied-job">
        <div className="apply-title">
          <h2>Applied Jobs</h2>
          <span className="underline"></span>
        </div>
        {appliedJobs.length === 0 ? (
          <p>No job applications found</p>
        ) : (
          <div className="seeker-apply-job-container">
            {!isSmallScreen ? (
              <table className="apply-job-details">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Description</th>
                    <th>Requirements</th>
                    <th>Skills</th>
                    <th>Education</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Salary Range</th>

                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody style={{ textTransform: "capitalize" }}>
                  {appliedJobs.map((applyjob) => (
                    <tr key={applyjob.id}>
                      <td>{applyjob.jobListing?.title}</td>
                      <td>{applyjob.jobListing?.description || "N/A"}</td>
                      <td>{applyjob.jobListing?.requirements || "N/A"}</td>
                      <td>{applyjob.jobListing?.preferredSkills || "N/A"}</td>
                      <td>{applyjob.jobListing?.address || "N/A"}</td>
                      <td>{applyjob.jobListing?.education || "N/A"}</td>
                      <td>{applyjob.jobListing?.experience || "N/A"}</td>
                      <td>{applyjob.jobListing?.salary_range || "N/A"}</td>
                      <td>
                        <i
                          style={{ color: " #0052b0" }}
                          className="fas fa-trash"
                          onClick={() => handleDeleteAppliedJob(applyjob.id)}
                          title="Delete Application"
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Table
                data={appliedJobs}
                handleDeleteAppliedJob={handleDeleteAppliedJob}
                type={"job applied"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfile;
