const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'immanueldiai',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const productSchema = mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Every product must belong to a category.'],
        enum: ["food", "snack", "drink"],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Every product must have a name.'],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Every product must have a price.']
    },
    photo: {
        type: String
    },
    photoId: {
        type: String
    },
    onTheMenuForTheDay: {
        type: Boolean,
        default: false
    }
});

productSchema.pre(/^findOneAndDelete/, async function (next) {
    this.product = await this.findOne();
    next();
});

productSchema.post(/^findOneAndDelete/, async function () {
    if (this.product.photoId) await cloudinary.v2.uploader.destroy(this.product.photoId);
});

module.exports = Product = mongoose.model('Product', productSchema);