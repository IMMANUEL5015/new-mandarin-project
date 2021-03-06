const Product = require('../models/products');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const findMultiple = require('../utilities/findMultiple');

exports.addNewProduct = catchAsync(async (req, res, next) => {
    const { name, price, category, photo, photoId } = req.body;
    const newProduct = await Product.create({ name, price, category, photo, photoId });
    const message = "You have successfully added a new product!";
    return responses.sendSuccessResponse(res, statusCodes.created, message, 1, newProduct);
});

exports.seeAllProducts = catchAsync(async (req, res, next) => {
    const allProducts = await findMultiple(Product, req.query);
    const message = "Successfully retrieved the products!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, allProducts.length, allProducts);
});

exports.seeSpecificProduct = catchAsync(async (req, res, next) => {
    const errMsg = 'The product you are looking for does not exist.';
    const product = await Product.findById(req.params.product_id);
    if (!product) return next(new AppError(errMsg, statusCodes.not_found));
    const message = "Successfully retrieved the product!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const errMsg = 'The product you want to update does not exist.';
    const updatedProduct = await Product.findByIdAndUpdate(req.params.product_id, req.body, {
        new: true
    });
    if (!updatedProduct) return next(new AppError(errMsg, statusCodes.not_found));
    const message = "Successfully updated the product!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, 1, updatedProduct);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const errMsg = 'The product you want to delete does not exist.';
    const deletedProduct = await Product.findByIdAndDelete(req.params.product_id);
    if (!deletedProduct) return next(new AppError(errMsg, statusCodes.not_found));
    return res.status(204).json();
});

exports.seeProductsOnTheMenu = catchAsync(async (req, res, next) => {
    req.query.onTheMenuForTheDay = true;
    const allProducts = await findMultiple(Product, req.query);
    const message = "Successfully retrieved the products on the menu!";
    return responses.sendSuccessResponse(res, statusCodes.ok, message, allProducts.length, allProducts);
});