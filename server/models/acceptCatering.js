const mongoose = require('mongoose');

const acceptCateringSchema = mongoose.Schema({
    cateringOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'CateringOrder' },
    status: { type: String, enum: ["yes"], default: "yes" },
    message: { type: String, required: [true, 'Please craft an acceptance message.'] },
    finalCost: { type: Number, required: [true, "Please specify your final charge amount."] },
    transportCost: { type: Number, required: [true, "Please specify your charge for transporting the food items to the venue."] },
    servingCost: { type: Number, required: [true, "Please specify how much it will cost you to handle the serving of food at the occasion."] },
    packagingCost: { type: Number, required: [true, "Please specify how much it will cost you to ensure that the food is properly packaged."] },
    rawMaterialsCost: { type: Number, required: [true, "Please specify how much it will cost you to purchase the raw materials needed to prepare the food."] },
    catererCompensation: { type: Number, required: [true, "Please specify your cooking fees."] },
    date: { type: Date, default: Date.now }
});

module.exports = AcceptCatering = mongoose.model('AcceptCatering', acceptCateringSchema);