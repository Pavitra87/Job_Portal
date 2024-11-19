import React from "react";
import "./Table.css";

const Table = ({
  data,
  handleDeleteJob,
  type,
  handleDeleteAppliedJob,
  handleViewApplicants,
  handleOpenEditModal,
}) => {
  return (
    <>
      <div className="table_body">
        <div className="table_body_container">
          {data.map((item, idx) => {
            return (
              <div className="table_box">
                <div className="table_box_container">
                  <div className="table_box_head">id:</div>
                  <div className="table_box_des">{idx + 1}</div>
                </div>
                {item?.seeker?.username && (
                  <div className="table_box_container">
                    <div className="table_box_head">name:</div>
                    <div className="table_box_des">
                      {item?.seeker?.username}
                    </div>
                  </div>
                )}
                {(item?.title || item?.jobListing?.title) && (
                  <div className="table_box_container">
                    <div className="table_box_head">job title:</div>
                    <div className="table_box_des">
                      {item?.title ? item?.title : item?.jobListing?.title}
                    </div>
                  </div>
                )}
                {(item?.description || item?.jobListing?.description) && (
                  <div className="table_box_container">
                    <div className="table_box_head">description:</div>
                    <div className="table_box_des">
                      {item?.description
                        ? item?.description
                        : item?.jobListing?.description}
                    </div>
                  </div>
                )}
                {(item?.requirements || item?.jobListing?.requirements) && (
                  <div className="table_box_container">
                    <div className="table_box_head">requirements:</div>
                    <div className="table_box_des">
                      {item?.requirements
                        ? item?.requirements
                        : item?.jobListing?.requirements}
                    </div>
                  </div>
                )}
                {item?.seeker?.email && (
                  <div className="table_box_container">
                    <div className="table_box_head">email:</div>
                    <div className="table_box_des">{item?.seeker?.email}</div>
                  </div>
                )}
                {item?.seeker?.profile?.phone_number && (
                  <div className="table_box_container">
                    <div className="table_box_head">contact no: </div>
                    <div className="table_box_des">
                      {item?.seeker?.profile?.phone_number}
                    </div>
                  </div>
                )}
                {(item.seeker?.profile?.skills ||
                  item?.preferredSkills ||
                  item?.jobListing?.preferredSkills) && (
                  <div className="table_box_container">
                    <div className="table_box_head">skills:</div>
                    <div className="table_box_des">
                      {item.seeker?.profile?.skills
                        ? item.seeker?.profile?.skills
                        : item?.preferredSkills
                        ? item?.preferredSkills
                        : item?.jobListing?.preferredSkills}
                    </div>
                  </div>
                )}
                {(item?.seeker?.profile?.education ||
                  item?.education ||
                  item?.jobListing?.education) && (
                  <div className="table_box_container">
                    <div className="table_box_head">education:</div>
                    <div className="table_box_des">
                      {item?.seeker?.profile?.education
                        ? item?.seeker?.profile?.education
                        : item?.education
                        ? item?.education
                        : item?.jobListing?.education}
                    </div>
                  </div>
                )}
                {(item?.seeker?.profile?.experience ||
                  item?.experience ||
                  item?.jobListing?.experience) && (
                  <div className="table_box_container">
                    <div className="table_box_head">experience:</div>
                    <div className="table_box_des">
                      {item?.seeker?.profile?.experience
                        ? item?.seeker?.profile?.experience
                        : item?.experience
                        ? item?.experience
                        : item?.jobListing?.experience}
                    </div>
                  </div>
                )}
                {(item?.seeker?.profile?.location || item?.address) && (
                  <div className="table_box_container">
                    <div className="table_box_head">location:</div>
                    <div className="table_box_des">
                      {item?.seeker?.profile?.location
                        ? item?.seeker?.profile?.location
                        : item?.address}
                    </div>
                  </div>
                )}
                {item?.seeker?.profile?.jobtype && (
                  <div className="table_box_container">
                    <div className="table_box_head">job type:</div>
                    <div className="table_box_des">
                      {item?.seeker?.profile?.jobtype}
                    </div>
                  </div>
                )}
                {(item?.salary_range || item?.jobListing?.salary_range) && (
                  <div className="table_box_container">
                    <div className="table_box_head">salary range:</div>
                    <div className="table_box_des">
                      {item?.salary_range
                        ? item?.salary_range
                        : item?.jobListing?.salary_range}
                    </div>
                  </div>
                )}
                {type === "job post" && (
                  <div className="table_box_container">
                    <div className="table_box_head">edit:</div>
                    <div className="table_box_des">
                      <i
                        className="fas fa-edit"
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Job"
                      ></i>
                    </div>
                  </div>
                )}
                {(type === "job post" || type === "job applied") && (
                  <div className="table_box_container">
                    <div className="table_box_head">delete:</div>
                    <div className="table_box_des">
                      <i
                        className="fas fa-trash"
                        onClick={() => {
                          type === "job post"
                            ? handleDeleteJob(item.id)
                            : handleDeleteAppliedJob(item.id);
                        }}
                        title="Delete Job"
                      ></i>
                    </div>
                  </div>
                )}
                {type === "job post" && (
                  <div className="table_box_container">
                    <div className="table_box_head">View Applicants:</div>
                    <div className="table_box_des">
                      <button onClick={() => handleViewApplicants(item)}>
                        View Applicants
                      </button>
                    </div>
                  </div>
                )}
                {item?.seeker?.profile?.resume && (
                  <div className="table_box_container">
                    <div className="table_box_head">resume</div>
                    <div className="table_box_des">
                      <a
                        href={`http://localhost:5001/${item?.seeker.profile.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    </div>
                  </div>
                )}
                {/* {
                  <div className="table_box_container">
                    <div className="table_box_head">id</div>
                    <div className="table_box_des">{idx + 1}</div>
                  </div>
                } */}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Table;
