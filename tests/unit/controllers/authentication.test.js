const User = require('../../../server/models/user');
const authentication = require('../../../server/controllers/authentication');
const newUser = require('../../../dev-data/user.json');
const httpMocks = require('node-mocks-http');

let req, res, next;

User.create = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

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
            "password": "chukaglorY55",
            "confirmPassword": "chukaglorY55"
        });
    });

    it("should attach the newly created user to the request object and call next", async () => {
        req.body = newUser;
        User.create.mockReturnValue(newUser);
        await authentication.register(req, res, next);
        expect(req.user).toEqual(newUser);
        expect(next).toBeCalled();
    });
});