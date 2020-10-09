const FoodOrder = require('../models/foodOrder');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const foodOrders = require('../utilities/foodOrders');


exports.placeOrder = async (req, res, next) => {
    try {
        const msg = "You have successfully placed your order.";
        const newOrder = await FoodOrder.create({
            user: req.user.id,
            products: req.body.products,
            cost: req.body.cost,
            deliveryAddress: req.body.deliveryAddress,
            paymentOption: req.body.paymentOption
        });
        return responses.sendSuccessResponse(res, statusCodes.created, msg, 1, newOrder);
    } catch (err) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}

exports.seeAllFoodOrders = async (req, res, next) => {
    try {
        const all = await FoodOrder.find().sort('-createdAt');
        const message = "Successfully retrieved all the food orders!";

        let totalSales = foodOrders.calcTotalAmount(all);

        return responses.foodOrdersRes(res, statusCodes.ok, message, all.length, all, totalSales);
    } catch (err) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}

exports.seeMyFoodOrders = async (req, res, next) => {
    try {
        const all = await FoodOrder.find({ user: req.user.id }).sort('-createdAt');
        const message = "Successfully retrieved all your food orders!";

        let totalCost = foodOrders.calcTotalAmount(all);

        return responses.myfoodOrdersRes(res, statusCodes.ok, message, all.length, all, totalCost);
    } catch (err) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}

exports.seeSpecificFoodOrder = async (req, res, next) => {
    try {
        const errMsg = 'The food order you are looking for does not exist.';
        const foodOrder = await FoodOrder.findById(req.params.food_order_id);

        if (!foodOrder) return responses.sendErrorResponse(res, statusCodes.not_found, errMsg);
        req.foodOrder = foodOrder;
        return next();
    } catch (error) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: error.message });
    }
}

exports.updateFoodOrder = async (req, res, next) => {
    const foodOrder = req.foodOrder;
    try {
        if
        (foodOrder.canBeDelivered || foodOrder.paid ||
        foodOrder.isEnRoute || foodOrder.isDelivered
        ) {
            const errMsg = "You cannot change the details of this food order anymore!";
            return responses.sendErrorResponse(res, statusCodes.bad_request, errMsg);
        }

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
    } catch (error) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: error.message });
    }
}