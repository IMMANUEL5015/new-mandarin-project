const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const Product = require('../models/products');

exports.checkIfProductsAreOnTheMenu = async (req, res, next) => {
    try {
        const msg = "You can't place an order for a product that is not on the menu."
        const products = req.body.products;

        let productsOnCart = [];
        for (i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].product);
            productsOnCart.push(product);
        }

        for (i = 0; i < productsOnCart.length; i++) {
            if (!productsOnCart[i].onTheMenuForTheDay) {
                return responses.sendErrorResponse(res, statusCodes.bad_request, msg);
            }
        }

        req.productsOnCart = productsOnCart;
        req.products = products;
        return next();
    } catch (err) {
        return responses.sendErrorResponse(res, statusCodes.server_error, err.msg);
    }
}

exports.calcTotalCost = async (req, res, next) => {
    const productsOnCart = req.productsOnCart;
    const products = req.products;
    let totalCost = 0;

    for (i = 0; i < productsOnCart.length; i++) {
        const costOfOne = productsOnCart[i].price * products[i].quantity;
        totalCost += costOfOne;
    }
    req.body.totalCost = totalCost;
    return next();
}