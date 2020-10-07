const statusCodes = require('../../statusCodes');

exports.signupSuccess = (req, res, next) => {
    return res.status(statusCodes.created).json({
        status: 'Success',
        message: 'You have successfully created your account.',
        token: req.token,
        userId: req.user.id
    });
}

exports.loginSuccess = (req, res, next) => {
    return res.status(statusCodes.ok).json({
        status: 'Success',
        message: 'You have successfully logged into your account.',
        token: req.token
    });
}

exports.sendErrorResponse = (res, statusCode, msg) => {
    if (typeof statusCode === "number") statusCode = JSON.stringify(statusCode);

    let status = 'error';

    if (statusCode.startsWith('4')) status = 'fail';

    return res.status(statusCode).json({ status, msg });
}