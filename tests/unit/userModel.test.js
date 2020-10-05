require('dotenv').config();
const User = require('../../server/models/user');
const bcrypt = require('bcryptjs');

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

describe("user.passwordHasChangedSinceTokenWasIssued", () => {
    it("should be a function", () => {
        expect(typeof user.passwordHasChangedSinceTokenWasIssued).toBe("function");
    });

    it("should return false by default", () => {
        expect(user.passwordHasChangedSinceTokenWasIssued()).toBeFalsy();
    });

    it("should return true if the jwtTimeStamp is lower than the passwordChangedAt", () => {
        expect(userTwo.passwordHasChangedSinceTokenWasIssued(1516239022)).toBeTruthy();
    });

    it("should return false if the jwtTimeStamp is higher than the passwordChangedAt", () => {
        expect(userTwo.passwordHasChangedSinceTokenWasIssued(1516239022273877929339023)).toBeFalsy();
    });
});