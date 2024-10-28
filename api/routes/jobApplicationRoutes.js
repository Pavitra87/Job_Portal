const router = require('express').Router();
const { createJobApplication, getJobApplication, getJobApplications, updateApllication, deleteApplication } = require('../controllers/job/jobApplicationCtrl');
const {authenticateToken,autherizationRoles}=require('../middleware/authenticateJwt')
const Roles=require('../middleware/roles')

router.post(`/apply`,authenticateToken,  autherizationRoles([Roles.JOB_SEEKER]),createJobApplication)

router.get('/apply/:id',authenticateToken,  autherizationRoles([Roles.JOB_SEEKER]),getJobApplication)
 
router.get('/', authenticateToken, autherizationRoles([Roles.JOB_PROVIDER]), getJobApplications)

router.put('/:id',authenticateToken,  autherizationRoles([Roles.JOB_SEEKER]),updateApllication)

router.delete('/:id',authenticateToken,  autherizationRoles([Roles.JOB_SEEKER]),deleteApplication)

module.exports=router;