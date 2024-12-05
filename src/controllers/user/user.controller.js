const User = require('../../models/User'); // Assuming your User model is in models/User.js
//const Subscription = require('../models/Subscription'); // Assuming you have a Subscription model

// Controller to fetch the Super Admin Dashboard data
const getSuperAdminDashboard = async (req, res, next) => {
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
    //   { $group: { _id: null, totalIncome: { $sum: '$amount' } } }
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

module.exports = { getSuperAdminDashboard };
