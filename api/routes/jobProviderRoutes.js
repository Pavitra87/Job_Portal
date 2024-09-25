const express=require('express');
const { createProfile, getProfile, getProfiles, updateProfile, deleteProfile } = require('../controllers/job/jobProviderCtrl');
const { authenticateToken } = require('../middleware/authenticateJwt');
const router=express.Router();

router.post('/',authenticateToken,createProfile)
router.get('/:id',getProfile)
router.get('/',getProfiles)
router.put('/:id',updateProfile)
router.post('/:id',deleteProfile)
module.exports=router;