const mongoose = require('mongoose');

const foodOrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number
            }
        }
    ],
    totalCost: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Please specify the address where you want your order to be delivered to.'],
        validate: {
            validator: function (value) {
                return value.match(/,/gi).length === 4;
            },
            message: 'Please ensure that your pickup address follows the specified format.'
        }
    },
    isEnRoute: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    paymentOption: {
        type: String,
        enum: ['on-delivery', 'online'],
        default: 'online'
    },
    canBeDelivered: {
        type: Boolean,
        default: false
    }
});

module.exports = FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);