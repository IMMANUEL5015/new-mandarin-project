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

exports.available = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { status: 'available' }, {
        new: true
    });
    const message = 'You are available for assignment to food deliveries.'
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, user);
});

exports.unAvailable = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { status: 'unavailable' }, {
        new: true
    });
    const message = 'You are unavailable for assignment to food deliveries.'
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, user);
});

exports.seeMyData = catchAsync(async (req, res, next) => {
    const message = "Successfully retrieved your personal details.";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, req.user);
});

exports.updateMyData = catchAsync(async (req, res, next) => {
    const obj = {};
    if (req.body.name) obj.name = req.body.name;
    if (req.body.photo) obj.photo = req.body.photo;
    if (req.body.photoId) obj.photoId = req.body.photoId;

    const user = await User.findByIdAndUpdate(req.user._id, obj, { new: true });

    const message = "Successfully updated your personal information.";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, user);
});

exports.deleteMyData = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { isActive: false }, { new: true });
    return res.status(204).json();
});

exports.reactivateAccount = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide the email address you used in registering.', 400));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('There is no user with the email address you provided.', 404));

    user.isActive = true;
    await user.save({ validateBeforeSave: false });

    return responses.sendSuccessResponse(res, 200, 'Successful Reactivation!', 1, user);
});

exports.changeUserRole = catchAsync(async (req, res, next) => {
    const { role } = req.body;
    if (!role) return next(new AppError('Please provide the new role of this user.', 400));

    const user = await User.findByIdAndUpdate(req.params.id, { role }, {
        new: true,
        runValidators: true
    });

    if (!user) return next(new AppError('This user does not exist!', 404));

    const message = "You have successfully updated the role of this user.";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, user);
});