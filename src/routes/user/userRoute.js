const { getSuperAdminDashboard, updateUserProfileImage,updateUserInfo, getUsers, activateUser, deactivateUser, deleteUser } = require('../../controllers/user/user.controller');
const { authenticate } = require('../../middlewares/auth/authenticate');
const { authorizeAdmin } = require('../../middlewares/auth/authorizeAdmin');
const upload =require('../../middlewares/upload');
const router = require('express').Router();

router.get('/admin/dashboard', getSuperAdminDashboard);
router.post('/upload-profile-image', authenticate , upload.single('image'),updateUserProfileImage);
router.put('/user/profile/update', authenticate,updateUserInfo);
router.get('/', authenticate, authorizeAdmin,getUsers);
router.put('/:id/activate', authenticate, authorizeAdmin, activateUser);
router.put('/:id/deactivate', authenticate, authorizeAdmin, deactivateUser);
router.delete('/:id', authenticate, authorizeAdmin, deleteUser);

module.exports = router;