const Sequelize = require('sequelize');
require('dotenv').config({ path: '../.env' });

let sequelize;
console.log("NODE_ENV:", process.env.NODE_ENV);

// create connection to db, passing in MySQL info from .env
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(process.env.MYSQL_DATABASE, 'root', process.env.MYSQL_ROOT_PASSWORD, {
    host: 'localhost',
    port: process.env.DB_PORT,
    dialect: 'mysql'
  });
}

module.exports = sequelize;