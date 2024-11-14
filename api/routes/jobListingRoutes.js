const router = require("express").Router();
const {
  createJobList,
  updateJoblist,
  getJoblists,
  deleteJoblist,

  getJobPost,
  getjobapplicants,
} = require("../controllers/job/jobListingCtrl");

const {
  authenticateToken,
  authorize,
} = require("../middleware/authenticateJwt");

router.post(
  "/create",
  authenticateToken,
  authorize("Job Provider"),
  createJobList
);
router.get(
  "/jobpost/:id",
  authenticateToken,
  authorize("Job Provider"),
  getJobPost
);
router.get("/", authenticateToken, authorize("Job Seeker"), getJoblists);

router.delete(
  "/:jobId",
  authenticateToken,
  authorize("Job Provider"),
  deleteJoblist
);
router.put(
  "/:jobId",
  authenticateToken,
  authorize("Job Provider"),
  updateJoblist
);

router.get(
  "/:jobId/applicants",
  authenticateToken,
  authorize("Job Provider"),
  getjobapplicants
);

module.exports = router;
