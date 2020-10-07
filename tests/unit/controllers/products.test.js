const Product = require('../../../server/models/products');
const products = require('../../../server/controllers/products');
const httpMocks = require('node-mocks-http');
const newProduct = require('../../../dev-data/product.json');
const allProducts = require('../../../dev-data/products.json');
const responses = require('../../../server/utilities/responses');

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

Product.create = jest.fn();
Product.find = jest.fn();
Product.findById = jest.fn();
responses.sendErrorResponse = jest.fn();

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

describe("products.seeAllProducts", () => {
    it("should be a function", () => {
        expect(typeof products.seeAllProducts).toBe("function");
    });

    it("should call Product.find", async () => {
        await products.seeAllProducts(req, res, next);
        expect(Product.find).toBeCalled();
    });

    it("should respond with all the products", async () => {
        Product.find.mockReturnValueOnce(allProducts);
        await products.seeAllProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: "Success",
            numOfProducts: 2,
            data: allProducts
        });
    });
});

describe("products.seeSpecificProduct", () => {
    it("should be a function", () => {
        expect(typeof products.seeSpecificProduct).toBe("function");
    });

    it("should call Product.findById", async () => {
        req.params.product_id = "product_id";
        await products.seeSpecificProduct(req, res, next);
        expect(Product.findById).toBeCalledWith("product_id");
    });

    it("should respond with an error if no product is found", async () => {
        const errMsg = 'The product you are looking for does not exist.';
        req.params.product_id = "product_id";
        Product.findById.mockReturnValueOnce(null);
        await products.seeSpecificProduct(req, res, next);
        expect(responses.sendErrorResponse).toBeCalledWith(res, 404, errMsg);
    });

    it("should respond with a success message, if product is found", async () => {
        req.params.product_id = "product_id";
        Product.findById.mockReturnValueOnce(newProduct);
        await products.seeSpecificProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'Success',
            data: newProduct
        });
    });
});