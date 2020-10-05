const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.verifyJwt = () => {
    return promisify(jwt.verify);
}