const mongoose = require('mongoose');

const cateringOrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    occasion: {
        type: String,
        required: [true, 'Please tell us the name of the occasion.'],
        enum: ['wedding', 'burial', 'birthday', 'other']
    },
    description: {
        type: String
    },
    location: {
        type: String,
        required: [true, 'Please tell us the venue.'],
        validate: {
            validator: function (value) {
                return value.match(/,/gi).length === 4;
            },
            message: 'Please ensure that the venue address follows the specified format.'
        }
    },
    date: {
        type: Date,
        required: [true, 'Please give us the date of the occasion.']
    },
    order: [
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
    paid: {
        type: String,
        default: "false"
    },
    paymentOption: {
        type: String,
        default: 'online',
        enum: ['online', 'bank-transfer', 'cash']
    },
    evidenceOfPayment: [{
        photo: {
            type: String,
            required: [true, 'Please upload your payment evidence.']
        },
        photoId: String
    }],
    isDelivered: {
        type: String,
        default: "false"
    },
    isPending: {
        type: String,
        default: "true"
    }
});

cateringOrderSchema.pre(/^findOneAndUpdate/, async function (next) {
    this.cateringOrder = await this.findOne();
    next();
});

cateringOrderSchema.post(/^findOneAndUpdate/, async function () {
    this.cateringOrder.updatedAt = Date.now();
    await this.cateringOrder.save();
});

module.exports = CateringOrder = mongoose.model('CateringOrder', cateringOrderSchema);