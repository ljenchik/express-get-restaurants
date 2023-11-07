const request = require("supertest");
const app = require("./src/app");
const { syncSeed } = require("./seed");

describe("tests endpoints", () => {
    beforeAll(async () => {
        await syncSeed();
    });
    test("tests GET /restaurants endpoint", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Array).toEqual(true);
        expect(response.body.length).toEqual(3);
        //console.log(response.body);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "AppleBees" }),
            ])
        );
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "Spice Grill" }),
            ])
        );
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "LittleSheep" }),
            ])
        );
        expect(response.body[0].name).toEqual("AppleBees");
        expect(response.body[1].name).toEqual("LittleSheep");
        expect(response.body[2].name).toEqual("Spice Grill");
        expect(response.body[0].location).toEqual("Texas");
        expect(response.body[1].location).toEqual("Dallas");
        expect(response.body[2].location).toEqual("Houston");
    });

    test("tests GET /restaurants/:id endpoint", async () => {
        const id = 2;
        const response = await request(app).get(`/restaurants/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Object).toEqual(true);
        expect(response.body.name).toEqual("LittleSheep");
        expect(response.body.location).toEqual("Dallas");
        expect(response.body.cuisine).toEqual("Hotpot");
    });

    test("tests GET /restaurants/:id endpoint with missing id", async () => {
        const id = 4;
        const response = await request(app).get(`/restaurants/${id}`);
        expect(response.body).toEqual({});
        expect(response.statusCode).toEqual(404);
    });

    test("tests POST /restaurants endpoint", async () => {
        const response = await request(app).post("/restaurants").send({
            name: "BusyBee",
            location: "Upminster",
            cuisine: "British",
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(4);
        expect(response.body[3].name).toEqual("BusyBee");
        expect(response.body[3].location).toEqual("Upminster");
        expect(response.body[3].cuisine).toEqual("British");
    });

    test("tests PUT /restaurants/:id endpoint", async () => {
        const id = 1;
        const response = await request(app).put(`/restaurants/${id}`).send({
            name: "Sushi",
            location: "Cranham",
            cuisine: "Japanese",
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(4);
        expect(response.body[id - 1].name).toEqual("Sushi");
        expect(response.body[id - 1].location).toEqual("Cranham");
        expect(response.body[id - 1].cuisine).toEqual("Japanese");
    });

    test("tests PUT /restaurants/:id endpoint", async () => {
        const id = 1;
        const response = await request(app).put(`/restaurants/${id}`).send({
            name: "Sushi",
            location: "Cranham",
            cuisine: "Japanese",
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(4);
        expect(response.body[id - 1].name).toEqual("Sushi");
        expect(response.body[id - 1].location).toEqual("Cranham");
        expect(response.body[id - 1].cuisine).toEqual("Japanese");
    });

    test("tests PUT /restaurants/:id endpoint with wrong id", async () => {
        const id = 10;
        const response = await request(app).put(`/restaurants/${id}`).send({
            name: "Sushi",
            location: "Cranham",
            cuisine: "Japanese",
        });
        expect(response.statusCode).toEqual(404);
    });

    test("tests DELETE /restaurants/:id endpoint", async () => {
        const id = 4;
        const response = await request(app).delete(`/restaurants/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(3);
    });

    test("tests DELETE /restaurants/:id endpoint with wrong id", async () => {
        const id = 6;
        const response = await request(app).delete(`/restaurants/${id}`);
        expect(response.statusCode).toEqual(404);
    });
});
