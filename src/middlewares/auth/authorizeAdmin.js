const CustomError = require('../../errors/CustomError');
const authorizeAdmin = (req, _res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return next(new CustomError('Access denied. Admins only.', 403));
    }
    next();
};

module.exports = {
    authorizeAdmin
};