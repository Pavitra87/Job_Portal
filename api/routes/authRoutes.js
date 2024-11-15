const router = require("express").Router();
const upload = require("../config/multer");
const { Register, Login } = require("../controllers/Auth/AuthController");

const {
  getAllJobSeekerProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  createJobSeekerProfile,
  createJobProviderProfile,
} = require("../controllers/profiles/profilectrl");
const {
  authenticateToken,
  authorize,
} = require("../middleware/authenticateJwt");

router.post("/login", Login);
router.post("/register", upload.single("profile_picture_url"), Register);

router.post(
  "/seeker",
  upload.single("resume"),
  authenticateToken,
  createJobSeekerProfile
);
router.post("/provider", authenticateToken, createJobProviderProfile);
router.get(
  "/profiles",
  authenticateToken,
  authorize("Job Provider"),
  getAllJobSeekerProfiles
);

router.get("/profile", authenticateToken, getProfile);
router.put("/profile/:id", authenticateToken, updateProfile);
router.delete("/profile/:id", authenticateToken, deleteProfile);

module.exports = router;
