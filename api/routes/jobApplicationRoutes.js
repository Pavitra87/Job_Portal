const express=require('express');
const { createJobApplication, getJobApplication, getJobApplications } = require('../controllers/job/jobApplicationCtrl');
const {authenticateToken,autherizationRoles}=require('../middleware/authenticateJwt')

const router=express.Router();

router.post('/jobs/:id/apply',authenticateToken,autherizationRoles(['job seeker']),createJobApplication)
router.get('/:id',authenticateToken,autherizationRoles(['job seeker']),getJobApplication)
router.get('/', authenticateToken,autherizationRoles(['job provider']), getJobApplications)