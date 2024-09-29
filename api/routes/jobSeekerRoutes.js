const express=require('express');
const { createProfile, getProfile, getProfiles, updateProfile, deleteProfile } = require('../controllers/job/jobSeekerCtrl');
const { authenticateToken } = require('../middleware/authenticateJwt');
const router=express.Router();

router.post('/create',authenticateToken, createProfile)
router.get('/:id',getProfile)
router.get('/',getProfiles)
router.put('/:id',authenticateToken,updateProfile)
router.delete('/:id',authenticateToken,deleteProfile)
module.exports=router;