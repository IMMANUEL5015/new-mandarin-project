require('dotenv').config();
const User = require('../../server/models/user');
const bcrypt = require('bcryptjs');

const user = new User({
    "name": "Immanuel Diai",
    "email": "immanueldiai@gmail.com",
    "password": process.env.PASSWORD,
    "confirmPassword": process.env.PASSWORD
});

bcrypt.compare = jest.fn();

describe("user.comparePasswords", () => {
    it("should be a function", () => {
        expect(typeof user.comparePasswords).toBe("function");
    });

    it("should call bcrypt.compare with the plain password and the encrypted password", async () => {
        await user.comparePasswords(process.env.PASSWORD, user.password);
        expect(bcrypt.compare).toBeCalledWith(process.env.PASSWORD, user.password);
    });
});