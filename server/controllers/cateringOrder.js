const CateringOrder = require('../models/cateringOrder');
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const responses = require('../utilities/responses');
const statusCodes = require('../../statusCodes');
const findMultiple = require('../utilities/findMultiple');
const orders = require('../utilities/orders');
const AppError = require('../utilities/appError');

exports.placeOrder = catchAsync(async (req, res, next) => {
    const cateringOrder = await CateringOrder.create({
        customer: req.user.id,
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
    req.query.customer = req.user.id;
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

exports.updateCateringOrder = catchAsync(async (req, res, next) => {
    const { products, location,
        paymentOption, cost,
        description, occasion, date, } = req.body;
    const obj = {};
    if (products) obj.products = products;
    if (location) obj.location = location;
    if (paymentOption) obj.paymentOption = paymentOption;
    if (cost) obj.cost = cost;
    if (description) obj.description = description;
    if (occasion) obj.occasion = occasion;
    if (date) obj.date = date;

    const updatedCateringOrder = await CateringOrder.findByIdAndUpdate(req.params.catering_order_id, obj, {
        new: true,
        runValidators: true
    });

    const message = "Successfully updated the catering order!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, updatedCateringOrder);
});

exports.deleteCateringOrder = catchAsync(async (req, res, next) => {
    await CateringOrder.findByIdAndDelete(req.params.catering_order_id);
    return res.status(204).json();
});

exports.assignSuperEmployee = catchAsync(async (req, res, next) => {
    let errMsg;

    const user = await User.findById(req.body.handler);
    if (!user) {
        errMsg = "The employee you want to assign to this catering order does not exist.";
        return next(new AppError(errMsg, statusCodes.not_found));
    }

    if (!(user.role === 'super-employee')) {
        errMsg = "The employee you want to assign to this catering order is not a top staff.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    const updatedCateringOrder = await CateringOrder.findByIdAndUpdate(req.params.catering_order_id, {
        handler: req.body.handler
    }, { new: true });

    const msg = `You have successfully assigned ${user.name} as the handler for this catering order.`;
    return responses.sendSuccessResponse(res, statusCodes.ok, msg, 1, updatedCateringOrder);
});