require('dotenv').config();
const request = require('supertest');
const app = require('../../server/app');
const newUser = require('../../dev-data/user.json');

const baseEndpoint = "/api/v1/";

describe("Register new user", () => {
    it("should return a token and a success message", async () => {
        const res = await request(app)
            .post(baseEndpoint + "register")
            .send(newUser);

        expect(res.statusCode).toBe(200);
    });
});

