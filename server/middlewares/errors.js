const AppError = require('../utilities/appError');

const handleJwtErr = () => {
    return new AppError('An error occured. Please login again!', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('You have been logged out of the application. Please login again.', 401);
}

const handleValidationErr = (error) => {
    const errors = Object.values(error.errors).map(el => el.message);
    const message = `Invalid Input Data. ${errors.join(' ')}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsErr = (error) => {
    const value = error.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
    const message = `${value} is already in use. Please use something else.`;
    return new AppError(message, 400);
}

const handleCastError = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, req, res, next) => {
    return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message
    });
}

const sendErrorProd = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            msg: err.message
        });
    }

    //Programming errors
    return res.status(500).json({
        status: 'error',
        msg: 'Something very wrong has happened!'
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, req, res, next);
    }

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;

        if (error.name === 'JsonWebTokenError') error = handleJwtErr();
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
        if (error.name === 'ValidationError') error = handleValidationErr(error);
        if (error.code === 11000) error = handleDuplicateFieldsErr(error);
        if (error.name === 'CastError') error = handleCastError(error);

        return sendErrorProd(error, req, res, next);
    }
}