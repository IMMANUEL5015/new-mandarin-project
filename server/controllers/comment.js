const catchAsync = require('../utilities/catchAsync');
const Comment = require('../models/comments');
const AppError = require('../utilities/appError');
const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');

exports.createComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.create({
        user: req.user.id,
        cateringOrder: req.params.catering_order_id,
        text: req.body.text
    });
    const message = "Comment Added!"
    return responses.sendSuccessResponse(res, statusCodes.created, message, 1, comment);
});