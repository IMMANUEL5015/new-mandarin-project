const responses = require('../../../server/utilities/responses');
const httpMocks = require('node-mocks-http');

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("responses.signupSuccess", () => {
    it("should be a function", () => {
        expect(typeof responses.signupSuccess).toBe("function");
    });

    it("should return a response with a token", () => {
        const token = "this-is-a-really-long-json-web-token";
        req.token = token;
        responses.signupSuccess(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual({
            status: 'Success',
            message: 'You have successfully created your account.',
            token: req.token
        });
    });
});

describe("responses.loginSuccess", () => {
    it("should be a function", () => {
        expect(typeof responses.loginSuccess).toBe("function");
    });

    it("should return a response with a token", () => {
        const token = "this-is-a-really-long-json-web-token";
        req.token = token;
        responses.loginSuccess(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({
            status: 'Success',
            message: 'You have successfully logged into your account.',
            token: req.token
        });
    });
});

describe("responses.sendErrorResponse", () => {
    it("should be a function", () => {
        expect(typeof responses.sendErrorResponse).toBe("function");
    });

    it("should an error response when called", () => {
        const errMsg = 'Please provide your email and password.';
        responses.sendErrorResponse(res, '400', errMsg);
        expect(res.statusCode).toBe("400");
        expect(res._getJSONData().status).toBe("fail");
        expect(res._getJSONData().msg).toBe(errMsg);
    });
});