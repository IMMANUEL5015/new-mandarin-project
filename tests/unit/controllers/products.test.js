const products = require('../../../server/controllers/products');

describe("products.addNewProduct", () => {
    it("should be a function", () => {
        expect(typeof products.addNewProduct).toBe("function");
    });
});