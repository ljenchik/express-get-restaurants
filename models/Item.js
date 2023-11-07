const Sequelize = require("sequelize");
const db = require("../db/connection");

const Item = db.define("items", {
    name: Sequelize.STRING,
    price: Sequelize.NUMBER,
});

module.exports = Item;
