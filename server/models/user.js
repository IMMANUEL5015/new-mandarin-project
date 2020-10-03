const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
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
        default: 'regular-employee',
        enum: ['developer', 'manager', 'assistant-manager', 'delivery-agent', 'super-employee']
    },
    photo: {
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
    registeredOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('User', userSchema);