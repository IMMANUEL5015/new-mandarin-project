const catchAsync = require('../utilities/catchAsync');
const findMultiple = require('../utilities/findMultiple');
const User = require('../models/user');
const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');
const AppError = require('../utilities/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const allUsers = await findMultiple(User, req.query);
    const message = "Successfully retrieved the registered users!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, allUsers.length, allUsers);
});

exports.getSpecificUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('The user you are looking for does not exist!', 404));

    const message = "Successfully retrieved the details!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, user);
});