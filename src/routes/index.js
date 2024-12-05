const express = require('express');
const router = express.Router();
const authRoute = require('./auth/authRoute');
const userRoute = require('./user/userRoute');

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/user/',userRoute);

module.exports = router;
