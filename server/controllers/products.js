const Product = require('../models/products');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');

exports.addNewProduct = async (req, res, next) => {
    try {
        const { name, price, category } = req.body;
        await Product.create({ name, price, category });
        return res.status(statusCodes.created).json({
            status: "Success",
            message: "You have successfully added a new product!"
        });
    } catch (err) {
        return responses.sendErrorResponse(res, statusCodes.server_error, err.message);
    }
}