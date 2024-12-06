const User = require('../../models/User');  
const CustomError = require('../../errors/CustomError');
const { uploadImageToCloudinary } = require('../../utils/imageUpload');
//const Subscription = require('../models/Subscription'); // Assuming you have a Subscription model

// Controller to fetch the Super Admin Dashboard data
const getSuperAdminDashboard = async (_req, res, next) => {
  try {
    // Fetch total active and deactivated users
    const activeUsers = await User.countDocuments({ isActive: true });
    const deactivatedUsers = await User.countDocuments({ isActive: false });

    // Fetch user plan breakdown (Free, Basic, Pro)
    // const freePlanUsers = await User.countDocuments({ 'subscription.plan': 'Free' });
    // const basicPlanUsers = await User.countDocuments({ 'subscription.plan': 'Basic' });
    // const proPlanUsers = await User.countDocuments({ 'subscription.plan': 'Pro' });

    // Fetch total income (assuming income is based on subscriptions)
    // const totalIncome = await Subscription.aggregate([
    //   { $group: { _id: null, totalrIncome: { $sum: '$amount' } } }
    // ]);

    // Fetch recent user registrations (latest 5 users)
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt');

    // Preparing the response data
    const dashboardData = {
      totalActiveUsers: activeUsers,
      totalDeactivatedUsers: deactivatedUsers,
    //   userPlanBreakdown: {
    //     free: freePlanUsers,
    //     basic: basicPlanUsers,
    //     pro: proPlanUsers,
    //   },
    //   totalIncome: totalIncome[0] ? totalIncome[0].totalIncome : 0,
    //   recentUserRegistrations: recentRegistrations,
    };

    res.status(200).json({
      message: 'Super Admin Dashboard Data',
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfileImage = async (req, res, next) => {
  try {
     
      const result = await  uploadImageToCloudinary(req.file);
      const user = await User.findOne({email:req.user.email});
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      user.imageUrl= result.secure_url;
      await user.save();

      res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (err) {
      
      next(new CustomError(err.message, 500));
  }
  };

const updateUserInfo =  async (req, res, next) => {
  try {
    const { username, email } = req.body;
 
    if (!username || !email) {
      return next(new CustomError('Username and email are required', 400));
    }
 
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }  
    );

    if (!updatedUser) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        imageUrl: updatedUser.imageUrl,
        role: updatedUser.role,
      },
    });
  } catch (error) {
 
    next(new CustomError('Error updating profile', 500));
  }
}

const getUsers = async(_req,res,next)=>{
  try {
    const users = await User.find({}, '-password -refreshTokens'); 
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    next(new CustomError('Error fetching users', 500));
  }
}

const activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      message: 'User activated successfully',
      user,
    });
  } catch (error) {
    next(new CustomError('Error activating user', 500));
  }
};

// Deactivate User
const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      message: 'User deactivated successfully',
      user,
    });
  } catch (error) {
    next(new CustomError('Error deactivating user', 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(new CustomError('Error deleting user', 500));
  }
};



module.exports = {
  getSuperAdminDashboard,
  updateUserProfileImage,
  updateUserInfo,
  getUsers,
  activateUser,
  deactivateUser,
  deleteUser
};
