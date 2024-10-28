const router = require('express').Router();
const {serchlisting, searchCandidate}=require('../controllers/job/jobSearching')
const {authenticateToken}=require('../middleware/authenticateJwt')

router.get(`/jobs/search`,authenticateToken, serchlisting);

router.get('/candidate/search',authenticateToken,searchCandidate)

module.exports=router;