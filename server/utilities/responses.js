exports.signTokenRes = (res, statusCode, msg, token) => {
    return res.status(statusCode).json({
        status: 'Success',
        msg,
        token
    });
}

exports.sendSuccessResponse = (res, statusCode, message, total, data) => {
    return res.status(statusCode).json({
        status: "Success",
        message,
        total,
        data
    });
}

//All the food orders
exports.foodOrdersRes = (res, statusCode, message, total, data, totalSales) => {
    return res.status(statusCode).json({
        status: "Success",
        totalSales,
        message,
        total,
        data
    });
}

//My Food Orders
exports.myfoodOrdersRes = (res, statusCode, message, total, data, totalCost) => {
    return res.status(statusCode).json({
        status: "Success",
        totalCost,
        message,
        total,
        data
    });
}