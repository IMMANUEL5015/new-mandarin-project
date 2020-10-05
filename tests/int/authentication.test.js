require('dotenv').config();
const request = require('supertest');
const app = require('../../server/app');
const newUser = require('../../dev-data/user.json');
const User = require('../../server/models/user');

const baseEndpoint = "/api/v1/";

beforeAll(async () => {
    try {
        await User.deleteMany({});
        console.log('All users deleted');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await User.deleteMany({});
        console.log('All users deleted');
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
    });
});

