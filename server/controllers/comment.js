const catchAsync = require('../utilities/catchAsync');
const Comment = require('../models/comments');
const AppError = require('../utilities/appError');
const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');
const findMultiple = require('../utilities/findMultiple');

exports.createComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.create({
        user: req.user.id,
        cateringOrder: req.params.catering_order_id,
        text: req.body.text
    });
    const message = "Comment Added!"
    return responses.sendSuccessResponse(res, statusCodes.created, message, 1, comment);
});

exports.seeAllComments = catchAsync(async (req, res, next) => {
    req.query.cateringOrder = req.params.catering_order_id;
    if (!req.query.sort) req.query.sort = "createdAt";
    const comments = await findMultiple(Comment, req.query);
    const message = "Successfully Retrieved All Comments!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, comments.length, comments);
});