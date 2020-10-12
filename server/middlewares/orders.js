exports.ensureThatThereAreProducts = (req, res, next) => {
    const products = req.body.products;
    if (!products || products.length === 0) {
        const msg = "You can't place an order without any product."
        return next(new AppError(msg, statusCodes.bad_request));
    }
    return next();
}