const express = require("express");
const {
  createJobList,
  updateJoblist,
  getJoblists,
  deleteJoblist,
  serchlisting,
  getJoblist,
} = require("../controllers/job/jobListingCtrl");

const {
  authenticateToken,
  autherizationRoles,
} = require("../middleware/authenticateJwt");

const router = express.Router();

router.post("/create",authenticateToken,autherizationRoles(['Job Provider']), createJobList);
// router.get(
//   "/:id",
//   authenticateToken,

//   getJoblist
// );
// router.get("/jobs", getJoblists);
// router.put(
//   "/jobs/:id",
//   authenticateToken,
//  updateJoblist
// );
// router.delete(
//   "/:id",
//   authenticateToken,
// deleteJoblist
// );

//search joblisting
router.get("/jobs/search", serchlisting);

module.exports =  router;
