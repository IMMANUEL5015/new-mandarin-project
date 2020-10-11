const statusCodes = require('../../statusCodes');
const AppError = require('../utilities/appError');

exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You are forbidden from performing this action!", statusCodes.forbidden));
        }
        return next();
    }
}

exports.checkUser = (req, res, next) => {
    const role = req.user.role;
    if (role === 'customer' || role === 'delivery-agent' || role === 'super-employee') {
        if (!req.user._id.equals(req.params.id)) {
            return next(new AppError('You are forbidden from performing this action.', 403));
        }
    }
    return next();
}