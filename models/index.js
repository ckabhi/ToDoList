var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize('abhishek', 'abhishek', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false
});
var db = {};

fs.readdirSync(__dirname).filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    }).forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;

    });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
