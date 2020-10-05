require('dotenv').config();
const auth = require('../../../server/middlewares/auth');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const User = require('../../../server/models/user');
const newUser = require('../../../dev-data/user.json');
const responses = require('../../../server/utilities/responses');
const authUtilities = require('../../../server/utilities/auth');

const user = new User({
    "name": "Immanuel Diai",
    "email": "immanueldiai@gmail.com",
    "password": process.env.PASSWORD,
    "confirmPassword": process.env.PASSWORD
});

const userTwo = new User({
    "name": "Immanuel Diai",
    "email": "immanueldiai@gmail.com",
    "password": process.env.PASSWORD,
    "confirmPassword": process.env.PASSWORD,
    "passwordChangedAt": Date.now()
});

User.findById = jest.fn();
user.comparePasswords = jest.fn();
responses.sendErrorResponse = jest.fn();
userTwo.passwordHasChangedSinceTokenWasIssued = jest.fn();

let req, res, next;

jwt.sign = jest.fn();
authUtilities.verifyJwt = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("auth.signToken", () => {
    it("should be a function", () => {
        expect(typeof auth.signToken).toBe("function");
    });

    it("should call jwt.sign with the user id, a secret and an expiry time", () => {
        req.user = user;
        auth.signToken(req, res, next);
        expect(jwt.sign).toBeCalledWith({ id: req.user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });
    });

    it("should attach the signed token to the req object and call next", () => {
        req.user = user;
        const token = "this-is-a-really-long-json-web-token";
        jwt.sign.mockReturnValue(token);
        auth.signToken(req, res, next);
        expect(req.token).toBe(token);
        expect(next).toBeCalled();
    })
});

describe("auth.continueTheLoginProcess", () => {
    it("should be a function", () => {
        expect(typeof auth.continueTheLoginProcess).toBe("function");
    });

    it("should return an error if there is no user", async () => {
        await auth.continueTheLoginProcess(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 401, "Your email or password is incorrect!");
    });

    it("should call user.comparePasswords with the entered password and the encrypted password", async () => {
        req.body = newUser;
        req.user = user;
        await auth.continueTheLoginProcess(req, res, next);
        expect(user.comparePasswords).toBeCalledWith(req.body.password, req.user.password);
    });

    it("should return an error if the password is not correct", async () => {
        req.user = user;
        req.body = newUser;
        user.comparePasswords.mockReturnValueOnce(false);
        await auth.continueTheLoginProcess(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 401, "Your email or password is incorrect!");
    });

    it("should call next", async () => {
        req.user = user;
        req.body = newUser;
        user.comparePasswords.mockReturnValueOnce(true);
        await auth.continueTheLoginProcess(req, res, next);
        expect(next).toBeCalled();
    });
});

describe("auth.protect", () => {
    it("should be a function", () => {
        expect(typeof auth.protect).toBe("function");
    });

    it("should respond with an error if token is absent from headers", async () => {
        req.headers.authorization = null;
        const msg = 'You are not logged in. If you have an account, please login. If you don\'t have an account, then please sign up.'
        await auth.protect(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 401, msg);
    });

    it("should verify the token", async () => {
        req.headers.authorization = `Bearer my-really-long-and-secure-jwt-token`;
        await auth.protect(req, res, next);
        expect(authUtilities.verifyJwt).toBeCalledWith('my-really-long-and-secure-jwt-token', process.env.JWT_SECRET);
    });

    it("should find the token's owner", async () => {
        req.headers.authorization = `Bearer my-really-long-and-secure-jwt-token`;
        const decoded = { id: 'user_unique_id', iat: 1516239022 };
        authUtilities.verifyJwt.mockReturnValueOnce(decoded);
        await auth.protect(req, res, next);
        expect(User.findById).toBeCalledWith(decoded.id);
    });

    it("should return an error if the user is no longer available", async () => {
        req.headers.authorization = `Bearer my-really-long-and-secure-jwt-token`;
        const decoded = { id: 'user_unique_id', iat: 1516239022 };
        authUtilities.verifyJwt.mockReturnValueOnce(decoded);
        User.findById.mockReturnValueOnce(null);
        await auth.protect(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 401, 'This user is no longer registered on our platform.');
    });

    it("should check to see if password changed since issuing of token", async () => {
        req.headers.authorization = `Bearer my-really-long-and-secure-jwt-token`;
        const decoded = { id: 'user_unique_id', iat: 1516239022 };
        authUtilities.verifyJwt.mockReturnValueOnce(decoded);
        User.findById.mockReturnValueOnce(userTwo);
        await auth.protect(req, res, next);
        expect(userTwo.passwordHasChangedSinceTokenWasIssued).toBeCalledWith(decoded.iat);
    });

    it("should return an error if password changed since issuing of token", async () => {
        req.headers.authorization = `Bearer my-really-long-and-secure-jwt-token`;
        const decoded = { id: 'user_unique_id', iat: 1516239022 };
        authUtilities.verifyJwt.mockReturnValueOnce(decoded);
        User.findById.mockReturnValueOnce(userTwo);
        userTwo.passwordHasChangedSinceTokenWasIssued.mockReturnValueOnce(true);
        await auth.protect(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 401, 'Your password changed recently. Please login again.');
    });

    it("should attach the logged in user to the req object and call next", async () => {
        req.headers.authorization = `Bearer my-really-long-and-secure-jwt-token`;
        const decoded = { id: 'user_unique_id', iat: 1516239022 };
        authUtilities.verifyJwt.mockReturnValueOnce(decoded);
        User.findById.mockReturnValueOnce(user);
        await auth.protect(req, res, next);
        expect(req.user).toEqual(user);
        expect(next).toBeCalled();
    });

});