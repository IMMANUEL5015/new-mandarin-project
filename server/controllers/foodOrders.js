const FoodOrder = require('../models/foodOrder');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');

exports.placeOrder = async (req, res, next) => {
    try {
        const msg = "You have successfully placed your order.";
        const newOrder = await FoodOrder.create({
            user: req.user.id,
            products: req.body.products,
            totalCost: req.body.totalCost,
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
        const allFoodOrders = await FoodOrder.find().sort('-createdAt');
        const message = "Successfully retrieved all the food orders!";
        return responses.sendSuccessResponse(res, statusCodes.ok, message, allFoodOrders.length, allFoodOrders);
    } catch (err) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}