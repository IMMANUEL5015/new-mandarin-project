const jwt = require('jsonwebtoken');
const statusCodes = require('../../statusCodes');
const responses = require('../utilities/responses');
const authUtilities = require('../utilities/auth');

exports.signToken = (req, res, next) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });

    //Attach token to res object

    req.token = token;
    return next();
}

exports.continueTheLoginProcess = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !(await user.comparePasswords(req.body.password, user.password))) {
            errMsg = "Your email or password is incorrect!";
            return responses.sendErrorResponse(res, statusCodes.unAuthenticated, errMsg);
        }

        return next();
    } catch (err) {
        console.error(err.message);
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}

exports.protect = async (req, res, next) => {
    try {
        let errMsg;
        let token;
        const auth = req.headers.authorization;

        if (auth && auth.startsWith('Bearer')) token = auth.split(' ')[1];
        //Also retrieve token from cookie

        if (!token) {
            errMsg = 'You are not logged in. If you have an account, please login. If you don\'t have an account, then please sign up.';
            return responses.sendErrorResponse(res, statusCodes.unAuthenticated, errMsg);
        }

        const decoded = await authUtilities.verifyJwt(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return responses.sendErrorResponse(res, statusCodes.unAuthenticated, 'This user is no longer registered on our platform.');

        if (user.passwordHasChangedSinceTokenWasIssued(decoded.iat)) {
            return responses.sendErrorResponse(res, statusCodes.unAuthenticated, 'Your password changed recently. Please login again.');
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(statusCodes.server_error).json({ status: 'error', msg: err.message });
    }
}