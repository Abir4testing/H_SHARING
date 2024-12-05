const { getSuperAdminDashboard } = require('../../controllers/user/user.controller');

const router = require('express').Router();

router.get('/admin/dashboard', getSuperAdminDashboard);


module.exports = router;
