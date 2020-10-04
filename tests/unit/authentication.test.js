const User = require('../../server/models/user');
const authentication = require('../../server/controllers/authentication');
const newUser = require('../../dev-data/user.json');
const httpMocks = require('node-mocks-http');

let req, res, next;

User.create = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("authentication.createUser", () => {
    it("should be a function", () => {
        expect(typeof authentication.createUser).toBe("function");
    });

    it("should call User.create with data from req.body", async () => {
        req.body = newUser;
        await authentication.createUser(req, res, next);
        expect(User.create).toBeCalledWith({
            "name": "Immanuel Diai",
            "email": "immanueldiai@gmail.com",
            "password": "chukaglorY55",
            "confirmPassword": "chukaglorY55"
        });
    });
});