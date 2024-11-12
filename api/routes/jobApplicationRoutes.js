const router = require("express").Router();
const {
  createJobApplication,
  getJobApplication,
  getJobApplications,
  updateApllication,
  deleteApplication,
} = require("../controllers/job/jobApplicationCtrl");
const {
  authenticateToken,
  authorize,
} = require("../middleware/authenticateJwt");
const Roles = require("../middleware/roles");

router.post(
  `/apply`,
  authenticateToken,
  authorize("Job Seeker"),
  createJobApplication
);

// router.get(
//   "/getapply/:id",
//   authenticateToken,
//   authorize("Job Seeker"),
//   getJobApplication
// );

router.delete(
  "/:id",
  authenticateToken,
  authorize("Job Seeker"),
  deleteApplication
);

module.exports = router;
