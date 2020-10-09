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

        //Calculate total sales
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

        //Calculate total cost
        let totalCost = foodOrders.calcTotalAmount(all);

        return responses.myfoodOrdersRes(res, statusCodes.ok, message, all.length, all, totalCost);
    } catch (err) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}