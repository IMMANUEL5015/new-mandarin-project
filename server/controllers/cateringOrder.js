const CateringOrder = require('../models/cateringOrder');
const catchAsync = require('../utilities/catchAsync');
const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');
const findMultiple = require('../utilities/findMultiple');
const orders = require('../utilities/orders');
const AppError = require('../utilities/appError');

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

exports.seeAllCateringOrders = catchAsync(async (req, res, next) => {
    const all = await findMultiple(CateringOrder, req.query);
    const message = "Successfully retrieved the catering orders!";
    let totalSales = orders.calcTotalAmount(all);
    return responses.ordersRes(res, statusCodes.ok, message, all.length, all, totalSales);
});

exports.seeMyCateringOrders = catchAsync(async (req, res, next) => {
    req.query.user = req.user.id;
    const all = await findMultiple(CateringOrder, req.query);
    const message = "Successfully retrieved your catering orders!";
    let totalExpenditure = orders.calcTotalAmount(all);
    return responses.myOrdersRes(res, statusCodes.ok, message, all.length, all, totalExpenditure);
});

exports.specificCateringOrder = catchAsync(async (req, res, next) => {
    const errMsg = 'The catering order you are looking for does not exist.';
    const cateringOrder = await CateringOrder.findById(req.params.catering_order_id);

    if (!cateringOrder) return next(new AppError(errMsg, statusCodes.not_found));
    req.cateringOrder = cateringOrder;
    return next();
});