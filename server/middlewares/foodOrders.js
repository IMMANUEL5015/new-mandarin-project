const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const Product = require('../models/products');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

exports.ensureThatThereAreProducts = (req, res, next) => {
    const products = req.body.products;
    if (!products || products.length === 0) {
        const msg = "You can't place an order without any product."
        return next(new AppError(msg, statusCodes.bad_request));
    }
    return next();
}

exports.checkIfProductsAreOnTheMenu = catchAsync(async (req, res, next) => {
    const msg = "You can't place an order for a product that is not on the menu."
    const products = req.body.products;

    if (products) {
        let productsOnCart = [];
        for (i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].product);
            productsOnCart.push(product);
        }

        for (i = 0; i < productsOnCart.length; i++) {
            if (!productsOnCart[i].onTheMenuForTheDay) {
                return next(new AppError(msg, statusCodes.bad_request));
            }
        }

        req.productsOnCart = productsOnCart;
        req.products = products;
    }
    return next();
});

exports.calcTotalCost = (req, res, next) => {
    const transportCost = 200;
    const productsOnCart = req.productsOnCart;
    const products = req.products;
    let cost = 0;
    if (productsOnCart && products) {
        for (i = 0; i < productsOnCart.length; i++) {
            const costOfOne = productsOnCart[i].price * products[i].quantity;
            cost += costOfOne;
        }
        req.body.cost = cost + transportCost;
    }
    return next();
}

exports.checkFoodOrderOwnership = (req, res, next) => {
    const foodOrder = req.foodOrder;
    if (req.user.role === "customer") {
        if (!foodOrder.user.equals(req.user.id)) {
            const msg = 'You are forbidden from performing this action!';
            return next(new AppError(msg, statusCodes.forbidden));
        }
    }
    req.foodOrder = foodOrder;
    return next();
}

//Specific Food Order
exports.retrievedFoodOrder = (req, res, next) => {
    const message = "Successfully retrieved the food order!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, req.foodOrder);
}

exports.checkIfFoodOrderCanBeModified = (req, res, next) => {
    const foodOrder = req.foodOrder;
    if
    (foodOrder.canBeDelivered || foodOrder.paid ||
    foodOrder.isEnRoute || foodOrder.isDelivered
    ) {
        const errMsg = "You cannot update or delete this food order anymore!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    return next();
}

exports.isPaidOrCanBeDelivered = (req, res, next) => {
    let errMsg;

    const foodOrder = req.foodOrder;

    if (foodOrder.paymentOption === 'online' && foodOrder.paid === false) {
        errMsg = 'This food order has not been paid for. Please wait for the customer to pay.';
        return next(new AppError(errMsg, statusCodes.bad_request));
    }

    if (foodOrder.paymentOption === 'on-delivery' && foodOrder.canBeDelivered === false) {
        errMsg = 'The customer has not certified that this food order should be delivered. Please wait!';
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    req.foodOrder = foodOrder;
    return next();
}