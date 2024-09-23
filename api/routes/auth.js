const router=require('express')
const {Register,Login}=require('../controllers/Auth')

router.post('/register',Register)
router.post('/login',Login)