const {registerUser,getMe , loginUser , LogoutUser} = require ('../Controller/userController')
const express = require('express')

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',LogoutUser);
router.get('/get',getMe)



module.exports = router