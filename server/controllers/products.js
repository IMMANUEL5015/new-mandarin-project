const Product = require('../models/products');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');

exports.addNewProduct = async (req, res, next) => {
    try {
        const { name, price, category } = req.body;
        const newProduct = await Product.create({ name, price, category });
        return res.status(statusCodes.created).json({
            status: "Success",
            message: "You have successfully added a new product!",
            productId: newProduct.id
        });
    } catch (err) {
        return responses.sendErrorResponse(res, statusCodes.server_error, err.message);
    }
}

exports.seeAllProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        return res.status(200).json({
            status: 'Success',
            numOfProducts: allProducts.length,
            data: allProducts
        });
    } catch (err) {
        return responses.sendErrorResponse(res, statusCodes.server_error, err.message);
    }
}

exports.seeSpecificProduct = async (req, res, next) => {
    try {
        const errMsg = 'The product you are looking for does not exist.';
        const product = await Product.findById(req.params.product_id);
        if (!product) return responses.sendErrorResponse(res, statusCodes.not_found, errMsg);
        return res.status(200).json({
            status: 'Success',
            data: product
        });
    } catch (err) {
        return responses.sendErrorResponse(res, statusCodes.server_error, err.message);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const errMsg = 'The product you want to update does not exist.';
        const updatedProduct = await Product.findByIdAndUpdate(req.params.product_id, req.body, {
            new: true
        });
        if (!updatedProduct) return responses.sendErrorResponse(res, statusCodes.not_found, errMsg);
        return res.status(200).json({
            status: 'Success',
            message: 'You have successfully updated this product.',
            data: updatedProduct
        });
    } catch (err) {
        return responses.sendErrorResponse(res, statusCodes.server_error, err.message);
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const errMsg = 'The product you want to delete does not exist.';
        const deletedProduct = await Product.findByIdAndDelete(req.params.product_id);
        if (!deletedProduct) return responses.sendErrorResponse(res, statusCodes.not_found, errMsg);
        return res.status(204).json();
    } catch (error) {
        return responses.sendErrorResponse(res, statusCodes.server_error, error.message);
    }
}