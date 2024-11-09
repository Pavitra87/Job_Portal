const router = require("express").Router();
const { Register, Login } = require("../controllers/Auth/AuthController");

const fs = require("fs");
const multer = require("multer");
const path = require("path");
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

// Configure multer storage
const uploadDir = "uploads/profile_pictures";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if directory exists; if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Route with multer middleware for profile picture upload
router.post("/register", upload.single("profile_picture_url"), Register);

router.post("/login", Login);

router.post(
  "/seeker",
  authenticateToken,
  authorize("Job Seeker"),
  createJobSeekerProfile
);
router.post(
  "/provider",
  authenticateToken,
  authorize("Job Provider"),
  createJobProviderProfile
);
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
