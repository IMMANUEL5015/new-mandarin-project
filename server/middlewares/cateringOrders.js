const Product = require('../models/products');
const catchAsync = require('../utilities/catchAsync');

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