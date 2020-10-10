const User = require('../models/user');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const auth = require('../utilities/auth');
const catchAsync = require('../utilities/catchAsync');

exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, devCode } = req.body;
    let userObj = { name, email, password, confirmPassword };
    if (devCode === process.env.DEV_CODE) userObj.role = 'developer';
    const user = await User.create(userObj);

    //Send the user a welcome email

    //Send an email to each user except customers, super-employee and delivery agents

    //Send a notification to each user except customers, super-employee and delivery agents
    const msg = 'You have successfully created your account.';
    const obj = { res, statusCode: statusCodes.created, msg }
    return auth.signToken(obj, user.id, process.env.JWT_EXPIRES);
});

exports.login = catchAsync(async (req, res, next) => {
    let errMsg;

    const { email, password } = req.body;

    if (!email || !password) {
        errMsg = 'Please provide your email and password.';
        return responses.sendErrorResponse(res, statusCodes.bad_request, errMsg);
    }

    const user = await User.findOne({ email }).select("+password");
    req.user = user;
    next();
});

exports.logout = (req, res, next) => {
    const msg = "You are now logged out of the application.";
    const obj = { res, statusCode: statusCodes.ok, msg }
    return auth.signToken(obj, req.user.id, 1);
}