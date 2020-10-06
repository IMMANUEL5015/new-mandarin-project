const permissions = require('../../../server/middlewares/permissions');
const restricition = permissions('manager', 'assistant-manager', 'super-employee');
const httpMocks = require('node-mocks-http');
const responses = require('../../../server/utilities/responses');

responses.sendErrorResponse = jest.fn();

describe("permissions", () => {
    it("should be a function", () => {
        expect(typeof permissions).toBe("function");
    });

    it("should return a function when called", () => {
        expect(typeof permissions()).toBe("function");
    });
});

describe("permissions()", () => {
    let req = httpMocks.createRequest();
    let res = httpMocks.createResponse();
    let next = jest.fn();

    it("should call next by default", () => {
        req.user = { "role": "manager" };
        restricition(req, res, next);
        expect(next).toBeCalled();
    });

    it("should return an error if the logged in user's role is forbidden", () => {
        req.user = { "role": "customer" };
        restricition(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 403, "You are forbidden from performing this action!");
    });
});