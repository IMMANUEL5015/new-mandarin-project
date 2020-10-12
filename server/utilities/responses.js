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

//All the food orders and catering orders
exports.ordersRes = (res, statusCode, message, total, data, totalSales) => {
    return res.status(statusCode).json({
        status: "Success",
        totalSales,
        message,
        total,
        data
    });
}

//My Food Orders and Catering Orders
exports.myOrdersRes = (res, statusCode, message, total, data, totalExpenditure) => {
    return res.status(statusCode).json({
        status: "Success",
        totalExpenditure,
        message,
        total,
        data
    });
}

exports.deliveryfoodOrdersRes = (res, statusCode, message, total, data, totalDeliveriesSales) => {
    return res.status(statusCode).json({
        status: "Success",
        totalDeliveriesSales,
        message,
        total,
        data
    });
}