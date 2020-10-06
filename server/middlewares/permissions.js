const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return responses.sendErrorResponse(res, statusCodes.forbidden, "You are forbidden from performing this action!");
        }
        return next();
    }
}