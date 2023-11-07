const express = require("express");
const app = express();
const { Restaurant, Menu, Item } = require("../models/index");
app.use(express.json());
app.use(express.urlencoded());

app.get("/restaurants", async (req, res) => {
    const restaurants = await Restaurant.findAll({
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
    res.json(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    if (!foundRestaurant) {
        res.status(404).end();
    } else {
        res.json(foundRestaurant);
    }
});

app.post("/restaurants", async (req, res) => {
    await Restaurant.create({
        name: req.body.name,
        location: req.body.location,
        cuisine: req.body.cuisine,
    });
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
});

app.put("/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    if (!foundRestaurant) {
        res.status(404).end();
    } else {
        await foundRestaurant.update(req.body);
        const allRestaurants = await Restaurant.findAll();
        res.json(allRestaurants);
    }
});

app.delete("/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    if (!foundRestaurant) {
        res.status(404).end();
    } else {
        await foundRestaurant.destroy();
        const allRestaurants = await Restaurant.findAll();
        res.json(allRestaurants);
    }
});

module.exports = app;
