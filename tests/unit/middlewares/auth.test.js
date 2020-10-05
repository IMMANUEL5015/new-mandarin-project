require('dotenv').config();
const auth = require('../../../server/middlewares/auth');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const User = require('../../../server/models/user');
const newUser = require('../../../dev-data/user.json');
const responses = require('../../../server/utilities/responses');

const user = new User({
    "name": "Immanuel Diai",
    "email": "immanueldiai@gmail.com",
    "password": process.env.PASSWORD,
    "confirmPassword": process.env.PASSWORD
});

user.comparePasswords = jest.fn();
responses.sendErrorResponse = jest.fn();

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