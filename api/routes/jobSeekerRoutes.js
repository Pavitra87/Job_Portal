const express=require('express');
const { createProfile, getProfile, getProfiles, updateProfile, deleteProfile } = require('../controllers/job/jobProviderCtrl');
const { authenticateToken } = require('../middleware/authenticateJwt');
const router=express.Router();

router.post('/',authenticateToken,autherizationRoles(['Job Seeker']), createProfile)
router.get('/:id',getProfile)
router.get('/',getProfiles)
router.put('/:id',authenticateToken,autherizationRoles(['Job Seeker']),updateProfile)
router.post('/:id',authenticateToken,autherizationRoles(['Job Provider']),deleteProfile)
module.exports=router;