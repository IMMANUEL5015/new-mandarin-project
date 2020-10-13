const statusCodes = require('../../statusCodes');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Comment = require('../models/comments');


exports.checkIfCateringOrderCanBeModified = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (cateringOrder.paid === "true" || cateringOrder.isDelivered === "true") {
        const errMsg = "You cannot create, update or delete any comment for this catering order anymore!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    return next();
}

exports.findComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.comment_id);
    const errMsg = 'The comment you are looking for cannot be found!';
    if (!comment) return next(new AppError(errMsg, statusCodes.not_found));
    req.comment = comment;
    return next();
});