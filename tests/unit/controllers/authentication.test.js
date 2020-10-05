require('dotenv').config();
const User = require('../../../server/models/user');
const authentication = require('../../../server/controllers/authentication');
const newUser = require('../../../dev-data/user.json');
const httpMocks = require('node-mocks-http');
const responses = require('../../../server/utilities/responses');

let req, res, next;

User.create = jest.fn();
User.findOne = jest.fn();
responses.sendErrorResponse = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

const user = new User({
    "name": "Immanuel Diai",
    "email": "immanueldiai@gmail.com",
    "password": process.env.PASSWORD,
    "confirmPassword": process.env.PASSWORD
});

user.select = jest.fn();
user.comparePasswords = jest.fn();

describe("authentication.register", () => {
    it("should be a function", () => {
        expect(typeof authentication.register).toBe("function");
    });

    it("should call User.create with data from req.body", async () => {
        req.body = newUser;
        await authentication.register(req, res, next);
        expect(User.create).toBeCalledWith({
            "name": "Immanuel Diai",
            "email": "immanueldiai@gmail.com",
            "password": "my-password",
            "confirmPassword": "my-password"
        });
    });

    it("should attach the newly created user to the request object and call next", async () => {
        req.body = newUser;
        User.create.mockReturnValueOnce(newUser);
        await authentication.register(req, res, next);
        expect(req.user).toEqual(newUser);
        expect(next).toBeCalled();
    });
});

describe("authentication.login", () => {
    it("should be a function", () => {
        expect(typeof authentication.login).toBe("function");
    });

    it("should return an error if email is missing", async () => {
        req.body = { "password": "my_password" };
        await authentication.login(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 400, 'Please provide your email and password.');
    });

    it("should return an error if password is missing", async () => {
        req.body = { "email": "myemail@gmail.com" };
        await authentication.login(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 400, 'Please provide your email and password.');
    });

    it("should call User.findOne with the user's email and query for the password also", async () => {
        req.body = newUser;
        User.findOne.mockReturnValueOnce(user);
        await authentication.login(req, res, next);
        expect(User.findOne).toBeCalledWith({ email: "immanueldiai@gmail.com" });
        expect(user.select).toBeCalledWith("+password");
    });

    it("should attach the user to the req object and call next", async () => {
        req.body = newUser;
        User.findOne.mockReturnValueOnce(user);
        user.select.mockReturnValueOnce(newUser);
        await authentication.login(req, res, next);
        expect(req.user).toEqual(newUser);
        expect(next).toBeCalled();
    });
});