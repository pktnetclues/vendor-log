const Sequelize = require("sequelize");

const sequelize = new Sequelize("", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Databse Connected Succesfully");
    })
    .catch((err) => {
        console.log("Errror Connecting", err.original.sqlMessage);
    });

module.exports = sequelize;