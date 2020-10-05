const jwt = require('jsonwebtoken');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');

exports.signToken = (req, res, next) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });

    req.token = token;
    return next();
}

exports.continueTheLoginProcess = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !(await user.comparePasswords(req.body.password, user.password))) {
            errMsg = "Your email or password is incorrect!";
            return responses.sendErrorResponse(res, statusCodes.unAuthenticated, errMsg);
        }

        return next();
    } catch (err) {
        console.error(err.message);
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}