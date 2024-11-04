const router = require("express").Router();
const {
  createJobList,
  updateJoblist,
  getJoblists,
  deleteJoblist,
  getJoblist,
} = require("../controllers/job/jobListingCtrl");
const {
  authenticateToken,
  authorize,
} = require("../middleware/authenticateJwt");
const Roles = require("../middleware/roles");

router.post(
  "/create",
  authenticateToken,
  authorize("Job Provider"),
  createJobList
);

// router.get(
//   "/:id",
//   authenticateToken,
//   autherizationRoles([Roles.JOB_PROVIDER]),
//   getJoblist
// );

router.get("/", authenticateToken, authorize("Job Seeker"), getJoblists);

// router.put(
//   "/:id",
//   authenticateToken,
//   autherizationRoles([Roles.JOB_PROVIDER]),
//   updateJoblist
// );

// router.delete(
//   "/:id",
//   authenticateToken,
//   autherizationRoles([Roles.JOB_PROVIDER]),
//   deleteJoblist
// );

module.exports = router;
