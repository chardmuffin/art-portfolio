// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// access .env file contents
require('dotenv').config();

// create connection to db, passing in MySQL info from .env
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;