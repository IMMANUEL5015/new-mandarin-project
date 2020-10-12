const CateringOrder = require('../models/cateringOrder');
const catchAsync = require('../utilities/catchAsync');
const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');

exports.placeOrder = catchAsync(async (req, res, next) => {
    const cateringOrder = await CateringOrder.create({
        user: req.user.id,
        occasion: req.body.occasion,
        description: req.body.description,
        location: req.body.location,
        date: new Date(req.body.date),
        products: req.body.products,
        cost: req.body.cost,
        paymentOption: req.body.paymentOption
    });

    const msgCompleted = "You have successfully placed your catering order.";
    const message = msgCompleted + " " + "One of our staff will get in touch with you soon.";
    return responses.sendSuccessResponse(res, statusCodes.created, message, 1, cateringOrder);
});