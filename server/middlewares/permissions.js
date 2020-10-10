const statusCodes = require('../../statusCodes');
const AppError = require('../utilities/appError');

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You are forbidden from performing this action!", statusCodes.forbidden));
        }
        return next();
    }
}