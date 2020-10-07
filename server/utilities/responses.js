exports.signTokenRes = (res, statusCode, msg, token) => {
    return res.status(statusCode).json({
        status: 'Success',
        msg,
        token
    });
}

exports.sendErrorResponse = (res, statusCode, msg) => {
    if (typeof statusCode === "number") statusCode = JSON.stringify(statusCode);

    let status = 'error';

    if (statusCode.startsWith('4')) status = 'fail';

    return res.status(statusCode).json({ status, msg });
}

exports.sendSuccessResponse = (res, statusCode, message, total, data) => {
    return res.status(statusCode).json({
        status: "Success",
        message,
        total,
        data
    });
}