const FoodOrder = require('../models/foodOrder');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const foodOrders = require('../utilities/foodOrders');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const findMultiple = require('../utilities/findMultiple');
const User = require('../models/user');

exports.placeOrder = catchAsync(async (req, res, next) => {
    const msg = "You have successfully placed your order.";
    const newOrder = await FoodOrder.create({
        user: req.user.id,
        products: req.body.products,
        cost: req.body.cost,
        deliveryAddress: req.body.deliveryAddress,
        paymentOption: req.body.paymentOption
    });
    return responses.sendSuccessResponse(res, statusCodes.created, msg, 1, newOrder);
});

exports.seeAllFoodOrders = catchAsync(async (req, res, next) => {
    const all = await findMultiple(FoodOrder, req.query);
    const message = "Successfully retrieved the food orders!";
    let totalSales = foodOrders.calcTotalAmount(all);
    return responses.foodOrdersRes(res, statusCodes.ok, message, all.length, all, totalSales);
});

exports.seeMyFoodOrders = catchAsync(async (req, res, next) => {
    req.query.user = req.user.id;
    const all = await findMultiple(FoodOrder, req.query);
    const message = "Successfully retrieved your food orders!";
    let totalExpenditure = foodOrders.calcTotalAmount(all);
    return responses.myfoodOrdersRes(res, statusCodes.ok, message, all.length, all, totalExpenditure);
});

exports.seeSpecificFoodOrder = catchAsync(async (req, res, next) => {
    const errMsg = 'The food order you are looking for does not exist.';
    const foodOrder = await FoodOrder.findById(req.params.food_order_id);

    if (!foodOrder) return next(new AppError(errMsg, statusCodes.not_found));
    req.foodOrder = foodOrder;
    return next();
});

exports.updateFoodOrder = catchAsync(async (req, res, next) => {
    const { products, deliveryAddress, paymentOption, cost } = req.body;
    const obj = {};
    if (products) obj.products = products;
    if (deliveryAddress) obj.deliveryAddress = deliveryAddress;
    if (paymentOption) obj.paymentOption = paymentOption;
    if (cost) obj.cost = cost;

    const updatedFoodOrder = await FoodOrder.findByIdAndUpdate(req.params.food_order_id, obj, {
        new: true,
        runValidators: true
    });

    const message = "Successfully updated the food order!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, updatedFoodOrder);
});

exports.deleteFoodOrder = catchAsync(async (req, res, next) => {
    await FoodOrder.findByIdAndDelete(req.params.food_order_id);
    return res.status(204).json();
});

exports.enRoute = catchAsync(async (req, res, next) => {
    let errMsg;

    const foodOrder = req.foodOrder;

    if (foodOrder.isEnRoute === "true") {
        errMsg = "This food order is already on it's way to the customer.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (!req.body.deliveryAgent) {
        errMsg = "You need to assign a delivery agent to this food order.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    const user = await User.findById(req.body.deliveryAgent);
    if (!user) {
        errMsg = "The delivery agent you want to assign to this food order does not exist.";
        return next(new AppError(errMsg, statusCodes.not_found));
    }

    if (!(user.role === 'delivery-agent')) {
        errMsg = "The user you want to assign to this food order is not a delivery agent.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (user.status === 'unavailable') {
        const stringOne = "The user you want to assign to this food order is currently not unavailable.";
        const stringTwo = "Please assign another delivery agent or wait for this agent to become available.";
        errMsg = `${stringOne} ${stringTwo}`;
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    const updatedFoodOrder = await FoodOrder.findByIdAndUpdate(req.params.food_order_id, {
        isEnRoute: "true",
        deliveryAgent: req.body.deliveryAgent
    }, { new: true });

    const msg = "You have successfully assigned a delivery agent to this food order.";
    return responses.sendSuccessResponse(res, statusCodes.ok, msg, 1, updatedFoodOrder);
});

exports.delivered = catchAsync(async (req, res, next) => {
    let errMsg;

    const foodOrder = req.foodOrder;

    if (foodOrder.isEnRoute === "false") {
        errMsg = "This food order is not yet on it's way to the customer.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (foodOrder.isDelivered === "true") {
        errMsg = "This food order has already been delivered to the customer.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    const updatedFoodOrder = await FoodOrder.findByIdAndUpdate(req.params.food_order_id, {
        isPending: "false", paid: "true", isDelivered: "true"
    }, { new: true });

    const msg = "You have certified that the food order has been delivered and that the customer has paid.";
    return responses.sendSuccessResponse(res, statusCodes.ok, msg, 1, updatedFoodOrder);
});

exports.canBeDelivered = catchAsync(async (req, res, next) => {
    let errMsg;
    const foodOrder = req.foodOrder;

    if (!foodOrder.user.equals(req.user.id)) {
        errMsg = 'You are forbidden from performing this action!';
        return next(new AppError(errMsg, statusCodes.forbidden));
    }

    if (foodOrder.paymentOption === 'online') {
        errMsg = 'You can only do this for food orders to be paid for upon delivery.';
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (foodOrder.isDelivered === "true") {
        errMsg = "This food order has already been delivered to you.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (foodOrder.isEnRoute === "true") {
        errMsg = "Sorry. The food order is already on it's way to you.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (foodOrder.canBeDelivered === "true") {
        errMsg = "You have already specified that this fod order can now be delivered to you.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    const updatedFoodOrder = await FoodOrder.findByIdAndUpdate(req.params.food_order_id, {
        canBeDelivered: "true"
    }, { new: true });

    const msg = "You have certified that the food order can now be delivered to you.";
    return responses.sendSuccessResponse(res, statusCodes.ok, msg, 1, updatedFoodOrder);
});

exports.getCustomerFoodOrders = catchAsync(async (req, res, next) => {
    req.query.user = req.params.id;
    const all = await findMultiple(FoodOrder, req.query);
    const message = "Successfully retrieved the food orders!";
    let totalExpenditure = foodOrders.calcTotalAmount(all);
    return responses.myfoodOrdersRes(res, statusCodes.ok, message, all.length, all, totalExpenditure);
});

exports.getDeliveryAgentFoodOrders = catchAsync(async (req, res, next) => {
    req.query.deliveryAgent = req.user.id;
    const all = await findMultiple(FoodOrder, req.query);
    const msg = "Successfully retrieved the food orders whose delivery you need to handle!";
    let totalDeliveriesSales = foodOrders.calcTotalAmount(all);
    return responses.deliveryfoodOrdersRes(res, statusCodes.ok, msg, all.length, all, totalDeliveriesSales);
});