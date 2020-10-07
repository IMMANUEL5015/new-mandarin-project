require('dotenv').config();
const request = require('supertest');
const app = require('../../server/app');
const newUser = require('../../dev-data/user.json');
const User = require('../../server/models/user');

jest.setTimeout(30000);

const baseEndpoint = "/api/v1/";

let id;

afterAll(async () => {
    try {
        await User.findByIdAndDelete(id);
        console.log('User deleted');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});

describe("Register new user", () => {
    it("should return a token and a success message", async () => {
        const res = await request(app)
            .post(baseEndpoint + "register")
            .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("Success");
        expect(res.body.message).toBe('You have successfully created your account.');
        expect(res.body.token).toBeTruthy();

        id = res.body.userId;
    });
});

let token;

describe("Login user", () => {
    it("should return a token and a success message", async () => {
        const res = await request(app)
            .post(baseEndpoint + "login")
            .send(newUser);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(res.body.message).toBe('You have successfully logged into your account.');
        expect(res.body.token).toBeTruthy();

        token = res.body.token;
    });
});

describe("Logout user", () => {
    it("should return a success message and a token", async () => {
        const res = await request(app)
            .get(baseEndpoint + "logout")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(res.body.message).toBe("You are now logged out of the application.");
        expect(res.body.token).toBeTruthy();
    });
});