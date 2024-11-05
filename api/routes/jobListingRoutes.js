const router = require("express").Router();
const {
  createJobList,
  updateJoblist,
  getJoblists,
  deleteJoblist,
  getJoblist,
  getJobPost,
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
  "/jobpost",
  authenticateToken,
  authorize("Job Provider"),
  getJobPost
);
router.get("/", authenticateToken, authorize("Job Seeker"), getJoblists);

router.delete(
  "/:id",
  authenticateToken,
  authorize("Job Provider"),
  deleteJoblist
);

router.put("/:id", authenticateToken, authorize("Job Provider"), updateJoblist);

module.exports = router;
