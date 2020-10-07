const jwt = require('jsonwebtoken');
const responses = require('./responses');

exports.signToken = (obj, id, expiresIn) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn
    });

    //Attach token to res cookie object
    return responses.signTokenRes(obj.res, obj.statusCode, obj.msg, token);
}