const jwt = require('jsonwebtoken');
const User = require('../models/user');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const auth = require('../utilities/auth');
const catchAsync = require('../utilities/catchAsync');

exports.signToken = (req, res, next) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });

    //Attach token to res cookie object

    req.token = token;
    return next();
}

exports.continueTheLoginProcess = catchAsync(async (req, res, next) => {
    const user = req.user;
    if (!user || !(await user.comparePasswords(req.body.password, user.password))) {
        errMsg = "Your email or password is incorrect!";
        return responses.sendErrorResponse(res, statusCodes.unAuthenticated, errMsg);
    }

    const msg = 'You have successfully logged into your account.';
    const obj = { res, statusCode: statusCodes.ok, msg }
    return auth.signToken(obj, user.id, process.env.JWT_EXPIRES);
});

exports.protect = catchAsync(async (req, res, next) => {
    let errMsg;
    let token;
    const auth = req.headers.authorization;

    if (auth && auth.startsWith('Bearer')) token = auth.split(' ')[1];
    //Also retrieve token from cookie

    if (!token) {
        errMsg = 'You are not logged in. If you have an account, please login. If you don\'t have an account, then please sign up.';
        return responses.sendErrorResponse(res, statusCodes.unAuthenticated, errMsg);
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return responses.sendErrorResponse(res, statusCodes.unAuthenticated, 'This user is no longer registered on our platform.');

    if (user.passwordHasChangedSinceTokenWasIssued(decoded.iat)) {
        return responses.sendErrorResponse(res, statusCodes.unAuthenticated, 'Your password changed recently. Please login again.');
    }

    req.user = user;
    return next();
});