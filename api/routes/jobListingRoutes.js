const router = require('express').Router();
const {createJobList,updateJoblist,getJoblists,deleteJoblist,getJoblist} = require("../controllers/job/jobListingCtrl");
const {authenticateToken,autherizationRoles,} = require("../middleware/authenticateJwt");
const Roles = require("../middleware/roles");



router.post("/create",authenticateToken,autherizationRoles([Roles.JOB_PROVIDER]),createJobList);

router.get("/:id",authenticateToken,autherizationRoles([Roles.JOB_PROVIDER]),getJoblist);

router.get("/", authenticateToken,getJoblists);

router.put("/:id",authenticateToken,autherizationRoles([Roles.JOB_PROVIDER]),updateJoblist);

router.delete("/:id",authenticateToken,autherizationRoles([Roles.JOB_PROVIDER]),deleteJoblist);


module.exports = router;
