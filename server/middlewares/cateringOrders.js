const catchAsync = require('../utilities/catchAsync');
const responses = require('../utilities/responses');
const AppError = require('../utilities/appError');
const statusCodes = require('../../statusCodes');

exports.calcTotalCost = catchAsync(async (req, res, next) => {
    if (req.body.finalCost) return next();
    const {
        transportCost, servingCost, packagingCost,
        rawMaterialsCost, catererCompensation
    } = req.body;

    req.body.finalCost = transportCost + servingCost + packagingCost + rawMaterialsCost + catererCompensation;
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

exports.checkCateringOrderHandler = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (req.user.role === "super-employee") {
        if (!cateringOrder.handler.equals(req.user.id)) {
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
        const errMsg = "You cannot perform any operation on this catering order anymore!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    req.cateringOrder = cateringOrder;
    return next();
}

exports.checkIfCateringOrderHasBeenPaidFor = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (!(cateringOrder.paid === "true") || cateringOrder.paid === "false") {
        const errMsg = "This catering order has not been paid for.";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    req.cateringOrder = cateringOrder;
    return next();
}

exports.checkIfCateringOrderHasAlreadyBeenDelivered = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (cateringOrder.isDelivered === "true") {
        const errMsg = "You cannot perform any operation on this catering order anymore!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    req.cateringOrder = cateringOrder;
    return next();
}


exports.checkForAcceptance = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (cateringOrder.acceptanceId) {
        const errMsg = "You cannot accept or decline a catering order that has already been accpeted!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    req.cateringOrder = cateringOrder;
    return next();
}

exports.ensureAcceptance = (req, res, next) => {
    const cateringOrder = req.cateringOrder;
    if (!cateringOrder.acceptanceId) {
        const errMsg = "You cannot pay for and upload evidence for a catering order that has not yet been accepted!";
        return next(new AppError(errMsg, statusCodes.bad_request));
    }
    req.cateringOrder = cateringOrder;
    return next();
}