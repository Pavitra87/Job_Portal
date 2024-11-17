import React from "react";
import "./jobseekerprofile.css";

const JobSeekerProfile = ({
  profileData,
  appliedJobs,
  handleDeleteAppliedJob,
}) => {
  const resumeUrl = profileData.profile?.resume
    ? `http://localhost:5001/${profileData.profile.resume}`
    : null;

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
                ? profileData.profile.skills.split(",").map((skill, index) => (
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
              <tbody>
                {appliedJobs.map((applyjob) => (
                  <tr key={applyjob.id}>
                    <td>{applyjob.jobListing.title}</td>
                    <td>{applyjob.jobListing.description}</td>
                    <td>{applyjob.jobListing.requirements}</td>
                    <td>{applyjob.jobListing.preferredSkills}</td>
                    <td>{applyjob.jobListing.address}</td>
                    <td>{applyjob.jobListing.education}</td>
                    <td>{applyjob.jobListing.experience}</td>
                    <td>{applyjob.jobListing.salary_range}</td>
                    <td>
                      <i
                        className="fas fa-trash"
                        onClick={() => handleDeleteAppliedJob(applyjob.id)}
                        title="Delete Application"
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfile;
