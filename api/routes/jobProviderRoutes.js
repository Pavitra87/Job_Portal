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


router.post("/create",authenticateToken,autherizationRoles(['job provider']),createProfile)
router.get("/:id",authenticateToken,autherizationRoles(['job provider']), getProfile);
router.get("/", authenticateToken,autherizationRoles(['job provider']),getProfiles);
router.put("/:id",authenticateToken,autherizationRoles(['job provider']), updateProfile);
router.delete("/:id",authenticateToken,autherizationRoles(['job provider']), deleteProfile);
module.exports = router;
