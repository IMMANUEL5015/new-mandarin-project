require('dotenv').config();
const request = require('supertest');
const app = require('../../server/app');
const newProduct = require('../../dev-data/product.json');
const Product = require('../../server/models/products');
const User = require('../../server/models/user');

jest.setTimeout(30000);

const baseEndpoint = "/api/v1/products/";

beforeAll(async () => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('All users deleted')
        console.log('All products deleted');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('All users deleted')
        console.log('All products deleted');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});

let token;

describe("Register new user", () => {
    it("should return a token and a success message", async () => {
        const res = await request(app)
            .post("/api/v1/" + "register")
            .send({
                "name": "Immanuel Diai",
                "email": "immanueldiai@gmail.com",
                "password": "my-password",
                "confirmPassword": "my-password",
                "devCode": process.env.DEV_CODE
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("Success");
        expect(res.body.message).toBe('You have successfully created your account.');
        expect(res.body.token).toBeTruthy();

        token = res.body.token;
    });
});

let product_id;

describe("Add New Product", () => {
    it("should return a success message", async () => {
        const res = await request(app)
            .post(baseEndpoint)
            .set("Authorization", `Bearer ${token}`)
            .send(newProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("Success");
        expect(res.body.message).toBe("You have successfully added a new product!");
    });
});

describe("See All Products", () => {
    it("should return a success message with all the products", async () => {
        const res = await request(app)
            .get(baseEndpoint);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(Array.isArray(res.body.data)).toBeTruthy();
        expect(res.body.data[0].name).toBe("Fried-Chicken");

        product_id = res.body.data.id;
    });
});

describe("See Specific Product", () => {
    it("should return a success message with the product", async () => {
        const res = await request(app)
            .get(baseEndpoint + product_id);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(Array.isArray(res.body.data)).toBeFalsy();
        expect(res.body.data.name).toBe("Fried-Chicken");
    });
});