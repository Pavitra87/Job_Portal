const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
  getProfiles,
  updateProfile,
  deleteProfile,
} = require("../controllers/job/jobProviderCtrl");
const { authenticateToken, autherizationRoles,} = require("../middleware/authenticateJwt");


router.post("/create",authenticateToken,createProfile)
router.get("/:id",authenticateToken, getProfile);
router.get("/",getProfiles);
router.put("/:id",authenticateToken, updateProfile);
router.delete("/:id",authenticateToken, deleteProfile);
module.exports = router;
