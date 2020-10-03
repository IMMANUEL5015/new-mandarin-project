const authentication = require('../../server/controllers/authentication');

describe("authentication.register", () => {
    it("should be a function", () => {
        expect(typeof authentication.register).toBe("function");
    });
});