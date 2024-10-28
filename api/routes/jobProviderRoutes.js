const router = require('express').Router();
const {createProfile,getProfile,getProfiles,updateProfile,deleteProfile,} = require("../controllers/job/jobProviderCtrl");
const { authenticateToken} = require("../middleware/authenticateJwt");

router.post("/create",authenticateToken,createProfile)

router.get("/:id",authenticateToken, getProfile);

router.get("/",getProfiles);

router.put("/:id",authenticateToken, updateProfile);

router.delete("/:id",authenticateToken, deleteProfile);

module.exports = router;
