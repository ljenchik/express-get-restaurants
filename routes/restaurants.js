const express = require("express");
const { Router } = require("express");
const restaurantsRouter = Router();
const { Restaurant, Menu, Item } = require("../models/index");
const { check, validationResult } = require("express-validator");
restaurantsRouter.use(express.json());
restaurantsRouter.use(express.urlencoded());

restaurantsRouter.get("/", async (req, res) => {
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

restaurantsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id, {
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
    if (!foundRestaurant) {
        res.status(404).end();
    } else {
        res.json(foundRestaurant);
    }
});

restaurantsRouter.post(
    "/",
    [
        check("name").not().isEmpty().trim(),
        check("location").not().isEmpty().trim(),
        check("cuisine").not().isEmpty().trim(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            await Restaurant.create({
                name: req.body.name,
                location: req.body.location,
                cuisine: req.body.cuisine,
            });
            const allRestaurants = await Restaurant.findAll();
            res.json(allRestaurants);
        }
    }
);

restaurantsRouter.put("/:id", async (req, res) => {
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

restaurantsRouter.delete("/:id", async (req, res) => {
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
module.exports = restaurantsRouter;
