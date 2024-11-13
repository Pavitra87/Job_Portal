import React from "react";
import "./jobproviderprofile.css";
import JobApplicants from "./JobApplicants";

const JobProviderProfile = ({
  profileData,
  jobPosts,
  handleEditJob,
  handleDeleteJob,
}) => {
  return (
    <div className="provider-container">
      <div className="provider-profile-details">
        <p>
          <strong>Location:</strong>
          <span>{profileData.profile.location}</span>
        </p>
        <p>
          <strong>Description:</strong>
          <span>{profileData.profile.description}</span>
        </p>
        <p>
          <strong>Phone Number:</strong>
          <span>{profileData.profile.phone_number}</span>
        </p>
      </div>

      <div className="provider-posts-job">
        <h2>Your Job Posts</h2>
        {jobPosts.length > 0 ? (
          <div className="provider-posts-job-container">
            <table className="job-details-table">
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
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>{job.requirements}</td>
                    <td>{job.preferredSkills}</td>
                    <td>{job.education}</td>
                    <td>{job.experience}</td>
                    <td>{job.address}</td>
                    <td>{job.salary_range}</td>
                    <td>
                      <i
                        className="fas fa-edit"
                        onClick={() => handleEditJob(job)}
                        title="Edit Job"
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fas fa-trash"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete Job"
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="job-applicants">
              {/* <JobApplicants /> */}
              {/* <h4>Applicants</h4>
              {applicants?.length > 0 ? (
                <ul>
                  {applicants.map((applicant) => (
                    <li key={applicant.id}>
                      <strong>{applicant.username}</strong> - {applicant.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No applicants yet.</p>
              )} */}
            </div>
          </div>
        ) : (
          <p>No job posts found.</p>
        )}
      </div>
    </div>
  );
};

export default JobProviderProfile;
