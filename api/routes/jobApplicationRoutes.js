const express=require('express');
const { createJobApplication } = require('../controllers/job/jobApplicationCtrl');

const router=express.Router();

router.post('/jobs/:id/apply',createJobApplication)