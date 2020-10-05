const { promisify } = require('util')
    ; const auth = require('../../../server/utilities/auth');
const jwt = require('jsonwebtoken');

describe("auth.verifyJwt", () => {
    it("should be a function", () => {
        expect(typeof auth.verifyJwt).toBe("function");
    });

    it("should return a promisified verison of jwt.verify", () => {
        expect(auth.verifyJwt() + "").toBe(promisify(jwt.verify) + "");
    });
});