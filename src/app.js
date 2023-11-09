const express = require("express");
const app = express();

const restaurantsRouter = require("./../routes/restaurants");
app.use("/restaurants", restaurantsRouter);

module.exports = app;
