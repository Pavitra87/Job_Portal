const express=require('express')
const router=express.Router();

const {serchlisting}=require('../controllers/job/jobSearching')
const {authenticateToken}=require('../middleware/authenticateJwt')

router.get(`/jobs/search`,authenticateToken, serchlisting);

module.exports=router;