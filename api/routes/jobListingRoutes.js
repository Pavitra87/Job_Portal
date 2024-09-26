const express = require("express");
const {
  createJobList,
  updateJoblist,
  getJoblists,
  deleteJoblist,
  serchlisting,
} = require("../controllers/job/jobListingCtrl");

const router = express.Router();

router.post("/jobs", createJobList);
router.get("/:id", updateJoblist);
router.get("/jobs", getJoblists);
router.put("/jobs/:id", updateJoblist);
router.delete("/:id", deleteJoblist);

//search joblisting
router.get("/jobs/search", serchlisting);

module.exports = { router };
