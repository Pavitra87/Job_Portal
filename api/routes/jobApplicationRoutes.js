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

router.get(
  "/getapply",
  authenticateToken,
  authorize("Job Seeker"),
  getJobApplication
);

// router.get('/', authenticateToken, autherizationRoles([Roles.JOB_PROVIDER]), getJobApplications)

// router.put('/:id',authenticateToken,  autherizationRoles([Roles.JOB_SEEKER]),updateApllication)

// router.delete('/:id',authenticateToken,  autherizationRoles([Roles.JOB_SEEKER]),deleteApplication)

module.exports = router;
