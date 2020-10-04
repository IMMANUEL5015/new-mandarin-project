const statusCodes = require('../../statusCodes');

exports.signupSuccess = (req, res, next) => {
    return res.status(statusCodes.created).json({
        status: 'Success',
        message: 'You have successfully created your account.',
        token: req.token
    });
}