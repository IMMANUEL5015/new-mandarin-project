require('dotenv').config();
const auth = require('../../../server/middlewares/auth');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const User = require('../../../server/models/user');

const user = new User({
    "name": "Immanuel Diai",
    "email": "immanueldiai@gmail.com",
    "password": "chukaglorY55",
    "confirmPassword": "chukaglorY55"
});

let req, res, next;

jwt.sign = jest.fn();

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