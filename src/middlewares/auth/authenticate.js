const jwt = require('jsonwebtoken');
const CustomError = require('../../errors/CustomError');
const { secretKey } = require('../../secret');
const User = require('../../models/User');

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.jwt || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
      return next(new CustomError('No token provided, access denied', 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new CustomError('Token expired, please log in again', 401));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(new CustomError('Invalid token, access denied', 401));
      }
      return next(new CustomError('Failed to authenticate token', 500));
    }
    console.log(decoded);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new CustomError('User not found, access denied', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new CustomError('Authentication server error', 500));
  }
};

module.exports = {
  authenticate,
};
