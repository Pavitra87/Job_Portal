const express = require("express");
const {
  createJobList,
  updateJoblist,
  getJoblists,
  deleteJoblist,
  serchlisting,
} = require("../controllers/job/jobListingCtrl");

const {authenticateToken,autherizationRoles}=require('../middleware/authenticateJwt')

const router = express.Router();

router.post("/jobs", authenticateToken,autherizationRoles(['Job Provider']),createJobList);
router.get("/:id",authenticateToken,autherizationRoles(['Job Provider']), getJoblists);
router.get("/jobs", getJoblists);
router.put("/jobs/:id",authenticateToken,autherizationRoles(['Job Provider']), updateJoblist);
router.delete("/:id",authenticateToken,autherizationRoles(['Job Provider']), deleteJoblist);

//search joblisting
router.get("/jobs/search", serchlisting);

module.exports = { router };
