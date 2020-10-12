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
    cost: {
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
        type: String,
        default: false
    },
    paid: {
        type: String,
        default: "false"
    },
    isDelivered: {
        type: String,
        default: "false"
    },
    paymentOption: {
        type: String,
        enum: ['on-delivery', 'online'],
        default: 'online'
    },
    canBeDelivered: {
        type: String,
        default: "false"
    },
    isPending: {
        type: String,
        default: "true"
    },
    transportCost: {
        type: Number,
        default: process.env.FOOD_ORDER_TRANSPORT_COST
    },
    deliveryAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

foodOrderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email role photo'
    }).populate({
        path: 'products.product',
        select: 'name price category photo'
    }).populate({
        path: 'deliveryAgent',
        select: 'name email role photo'
    });
    next();
});

foodOrderSchema.pre(/^findOneAndUpdate/, async function (next) {
    this.foodOrder = await this.findOne();
    next();
});

foodOrderSchema.post(/^findOneAndUpdate/, async function () {
    this.foodOrder.updatedAt = Date.now();
    await this.foodOrder.save();
});

module.exports = FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);