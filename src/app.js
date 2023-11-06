const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

app.get("/restaurants", async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    res.json(foundRestaurant);
});

app.use(express.json());
app.use(express.urlencoded());

app.post("/restaurants/create", async (req, res) => {
    await Restaurant.create({
        name: req.body.name,
        location: req.body.location,
        cuisine: req.body.cuisine,
    });
    res.send();
});

app.put("/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    await foundRestaurant.update({ name: req.body.name });
    res.send();
});

app.delete("/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    await foundRestaurant.destroy();
    res.send();
});

module.exports = app;
