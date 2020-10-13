const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cateringOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CateringOrder'
    },
    text: {
        type: String,
        required: [true, 'Your comment must include a text.']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email role photo'
    }).populate({
        path: 'cateringOrder'
    });
    next();
});

commentSchema.pre(/^findOneAndUpdate/, async function (next) {
    this.comment = await this.findOne();
    next();
});

commentSchema.post(/^findOneAndUpdate/, async function () {
    this.comment.updatedAt = Date.now();
    await this.comment.save();
});

module.exports = Comment = mongoose.model('Comment', commentSchema);