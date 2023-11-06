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

module.exports = app;
