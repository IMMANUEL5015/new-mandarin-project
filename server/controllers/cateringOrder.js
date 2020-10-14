const CateringOrder = require('../models/cateringOrder');
const AcceptCatering = require('../models/acceptCatering');
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
    const errMsg = 'The catering order does not exist.';
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

exports.getCustomerFoodOrders = catchAsync(async (req, res, next) => {
    req.query.customer = req.params.id;
    const all = await findMultiple(CateringOrder, req.query);
    const message = "Successfully retrieved the catering orders!";
    let totalExpenditure = orders.calcTotalAmount(all);
    return responses.myOrdersRes(res, statusCodes.ok, message, all.length, all, totalExpenditure);
});

exports.getHandlerCateringOrders = catchAsync(async (req, res, next) => {
    req.query.handler = req.user.id;
    const all = await findMultiple(CateringOrder, req.query);
    const msg = "Successfully retrieved the catering orders whose negotiations you need to handle!";
    let totalAmount = orders.calcTotalAmount(all);
    return responses.handlerCateringOrdersRes(res, statusCodes.ok, msg, all.length, all, totalAmount);
});

exports.acceptCateringOrder = catchAsync(async (req, res, next) => {
    const obj = { ...req.body };
    obj.cateringOrder = req.params.catering_order_id;

    const acceptCateringOrder = await AcceptCatering.create(obj);
    const cateringOrder = req.cateringOrder;

    cateringOrder.acceptanceId = acceptCateringOrder.id;
    cateringOrder.cost = obj.finalCost;
    await cateringOrder.save();

    const message = "You have accepted this catering order!";
    return responses.sendSuccessResponse(res, statusCodes.created, message, 1, acceptCateringOrder);
});

exports.submitPaymentEvidence = catchAsync(async (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    const obj = { photo: req.body.photo, photoId: req.body.photoId };
    cateringOrder.evidenceOfPayment.push(obj);
    const result = await cateringOrder.save();
    const message = "You have successfully updated your payment evidence.";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, result);
});