const Product = require('../../../server/models/products');
const products = require('../../../server/controllers/products');
const httpMocks = require('node-mocks-http');
const newProduct = require('../../../dev-data/product.json');

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

Product.create = jest.fn();

describe("products.addNewProduct", () => {
    it("should be a function", () => {
        expect(typeof products.addNewProduct).toBe("function");
    });

    it("should call Product.create with data from the request body", async () => {
        req.body = newProduct;
        await products.addNewProduct(req, res, next);
        expect(Product.create).toBeCalledWith({
            "name": "Fried-Chicken",
            "category": "food",
            "price": 1050
        });
    });

    it("should send a success response", async () => {
        req.body = newProduct;
        Product.create.mockReturnValueOnce(newProduct);
        await products.addNewProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toEqual({
            status: "Success",
            message: "You have successfully added a new product!"
        });
    });
});