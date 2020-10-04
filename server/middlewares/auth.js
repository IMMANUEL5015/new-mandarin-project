const jwt = require('jsonwebtoken');

exports.signToken = (req, res, next) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });

    req.token = token;
    return next();
}