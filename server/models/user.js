const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'immanueldiai',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your fullname.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        validate: [validator.isEmail, 'Please provide a valid email address.'],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['developer', 'manager', 'assistant-manager', 'delivery-agent', 'super-employee', 'customer']
    },
    photo: {
        type: String,
        default: "//www.gravatar.com/avatar/a539141daad8ea89a568540c071b897c?s=200&r=pg&d=mm"
    },
    photoId: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        select: false,
        minlength: [8, 'Your password should consist of at least eight characters.']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match!'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    /* Remember to create middleware for checking that a user has been 
     verified before they can perform certain actions on the app. */
    registeredOn: {
        type: Date,
        default: Date.now
    },
    passwordChangedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    isActive: {
        type: Boolean,
        default: true,
        enum: [true, false]
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
    }
    next();
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') && !this.isNew) this.passwordChangedAt = Date.now() - 1500;
    next();
});

userSchema.methods.comparePasswords = async (plainPassword, encryptedPassword) => {
    return await bcrypt.compare(plainPassword, encryptedPassword);
}

userSchema.methods.passwordHasChangedSinceTokenWasIssued = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const passwordChangedAtTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jwtTimeStamp < passwordChangedAtTimeStamp;
    }
    return false;
}

userSchema.pre(/^findOneAndDelete/, async function (next) {
    this.user = await this.findOne();
    next();
});

userSchema.post(/^findOneAndDelete/, async function () {
    if (this.user.photoId) await cloudinary.v2.uploader.destroy(this.user.photoId);
});

module.exports = User = mongoose.model('User', userSchema);