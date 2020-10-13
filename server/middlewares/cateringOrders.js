const Product = require('../models/products');
const catchAsync = require('../utilities/catchAsync');
const responses = require('../utilities/responses');
const AppError = require('../utilities/appError');
const statusCodes = require('../../statusCodes');

exports.calcTotalCost = catchAsync(async (req, res, next) => {
    const products = req.body.products;
    const productsOnCart = [];

    if (products) {
        for (i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].product);
            productsOnCart.push(product);
        }
    }

    const transportCost = process.env.CATERING_ORDER_TRANSPORT_COST;
    const servingCost = process.env.SERVING_COST;

    let cost = 0;
    if (productsOnCart && products) {
        for (i = 0; i < productsOnCart.length; i++) {
            const costOfOne = productsOnCart[i].price * products[i].quantity;
            cost += costOfOne;
        }
        req.body.cost = cost + parseInt(transportCost) + parseInt(servingCost);
    }
    return next();
});

exports.checkCateringOrderOwnership = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (req.user.role === "customer") {
        if (!cateringOrder.customer.equals(req.user.id)) {
            const msg = 'You are forbidden from performing this action!';
            return next(new AppError(msg, statusCodes.forbidden));
        }
    }
    req.cateringOrder = cateringOrder;
    return next();
}

exports.retrievedCateringOrder = (req, res, next) => {
    const message = "Successfully retrieved the catering order!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, req.cateringOrder);
}

exports.checkIfCateringOrderCanBeModified = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (cateringOrder.paid === "true" || cateringOrder.isDelivered === "true") {
        const errMsg = "You cannot update or delete this catering order anymore!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    return next();
}