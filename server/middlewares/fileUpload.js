const multer = require('multer');
const statusCodes = require('../../statusCodes');
const cloudinary = require('cloudinary');
const Product = require('../models/products');
const responses = require('../utilities/responses');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

cloudinary.config({
    cloud_name: 'immanueldiai',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const multerStorage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname + Date.now());
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        //Use App Error and the global Error Handler Later on
        cb(new AppError('Only Image Files are Allowed!', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 10 * 1024 * 1024 }
});

exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const result = await cloudinary.v2.uploader.upload(req.file.path, { width: 500, height: 500 });
    req.body.photo = result.secure_url;
    req.body.photoId = result.public_id;
    return next();
});

exports.resizePhotoForProductUpdate = catchAsync(async (req, res, next) => {
    const errMsg = 'The product you want to update does not exist.';
    const product = await Product.findById(req.params.product_id);
    if (!product) return next(new AppError(errMsg, statusCodes.not_found));

    if (!req.file) return next();

    if (product.photoId) await cloudinary.v2.uploader.destroy(product.photoId);

    const result = await cloudinary.v2.uploader.upload(req.file.path, { width: 500, height: 500 });
    req.body.photo = result.secure_url;
    req.body.photoId = result.public_id;
    return next();
});