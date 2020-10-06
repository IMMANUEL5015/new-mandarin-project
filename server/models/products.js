const mongoose = require('mongoose');

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
    image: {
        type: String,
        unique: true
    }
});

module.exports = Product = mongoose.model('Product', productSchema);