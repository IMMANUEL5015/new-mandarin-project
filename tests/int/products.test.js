require('dotenv').config();
const request = require('supertest');
const app = require('../../server/app');
const newProduct = require('../../dev-data/product.json');
const Product = require('../../server/models/products');
const User = require('../../server/models/user');

jest.setTimeout(30000);

const baseEndpoint = "/api/v1/products/";

let product_id;
let user_id;

afterAll(async () => {
    try {
        await Product.findByIdAndDelete(product_id);
        await User.findByIdAndDelete(user_id);
        console.log('User deleted')
        console.log('Product deleted');
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
        user_id = res.body.userId;
    });
});

describe("Add New Product", () => {
    it("should return a success message", async () => {
        const res = await request(app)
            .post(baseEndpoint)
            .set("Authorization", `Bearer ${token}`)
            .send(newProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("Success");
        expect(res.body.message).toBe("You have successfully added a new product!");

        product_id = res.body.productId;
    });
});

describe("See All Products", () => {
    it("should return a success message with all the products", async () => {
        const res = await request(app)
            .get(baseEndpoint);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(Array.isArray(res.body.data)).toBeTruthy();
        expect(res.body.data[0].name).toBeTruthy();
        expect(res.body.data[0].price).toBeTruthy();
        expect(res.body.data[0].category).toBeTruthy();
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

describe("Update Specific Product", () => {
    it("should return a success message with the product", async () => {
        const res = await request(app)
            .patch(baseEndpoint + product_id)
            .set("Authorization", `Bearer ${token}`)
            .send({ "name": "Goat-Meat", "price": 550 });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(res.body.data.name).toBe("Goat-Meat");
        expect(res.body.data.price).toBe(550);
        expect(res.body.message).toBe('You have successfully updated this product.');
    });
});

describe("Delete Specific Product", () => {
    it("should return a status code of 204", async () => {
        const res = await request(app)
            .delete(baseEndpoint + product_id)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
    });
});