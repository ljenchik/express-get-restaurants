const request = require("supertest"); // allows to make fake requests
const app = require("./src/app.js");
const { syncSeed } = require("./seed.js");
const { Restaurant, Menu, Item } = require("./models");
let quantity;

describe("tests endpoints", () => {
    beforeAll(async () => {
        await syncSeed();
        const restaurants = await Restaurant.findAll();
        quantity = restaurants.length;
    });
    test("tests GET /restaurants endpoint", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Array).toEqual(true);
        expect(response.body.length).toEqual(quantity);
        expect(response.body[0]).toHaveProperty("cuisine");
        //console.log(response.body);
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "AppleBees",
                location: "Texas",
                cuisine: "FastFood",
            })
        );
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "LittleSheep",
                location: "Dallas",
                cuisine: "Hotpot",
            })
        );
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "Spice Grill",
                location: "Houston",
                cuisine: "Indian",
            })
        );
    });

    test("tests GET /restaurants/:id endpoint", async () => {
        const id = 2;
        const response = await request(app).get(`/restaurants/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Object).toEqual(true);
        expect(response.body).toEqual(
            expect.objectContaining({
                name: "LittleSheep",
                location: "Dallas",
                cuisine: "Hotpot",
            })
        );
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
        expect(response.body.length).toEqual(quantity + 1);
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "BusyBee",
                location: "Upminster",
                cuisine: "British",
            })
        );
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
        expect(response.body.length).toEqual(quantity + 1);
        const foundRestaurant = await Restaurant.findByPk(id);
        expect(foundRestaurant.name).toEqual("Sushi");
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
        const id = 1;
        const response = await request(app).delete(`/restaurants/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(quantity);
        const restaurants = await Restaurant.findAll();
        expect(restaurants.length).toBe(quantity);
        expect(restaurants[0].id).not.toEqual(1);
    });

    test("tests DELETE /restaurants/:id endpoint with wrong id", async () => {
        const id = 6;
        const response = await request(app).delete(`/restaurants/${id}`);
        expect(response.statusCode).toEqual(404);
    });

    test("tests associations between restaurant, menus and items", async () => {
        const restaurant = await Restaurant.findByPk(2);
        const menu1 = await Menu.findByPk(1);
        const menu2 = await Menu.findByPk(2);
        const item1 = await Item.findByPk(1);
        const item2 = await Item.findByPk(2);
        await restaurant.addMenus([menu1, menu2]);
        await menu1.addItems([item1, item2]);
        const restaurantWithMenusItems = await Restaurant.findByPk(2, {
            include: Menu,
            include: [
                {
                    model: Menu,
                    include: [
                        {
                            model: Item,
                        },
                    ],
                },
            ],
        });
        console.log(JSON.stringify(restaurantWithMenusItems, null, 2));
        const restaurantsWithMenusItems = await Restaurant.findAll({
            include: Menu,
            include: [
                {
                    model: Menu,
                    include: [
                        {
                            model: Item,
                        },
                    ],
                },
            ],
        });
        console.log(JSON.stringify(restaurantsWithMenusItems, null, 2));
    });
});
