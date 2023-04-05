const Sequelize = require('sequelize');
require('dotenv').config({ path: '../.env' });

let sequelize;
console.log("NODE_ENV:", process.env.NODE_ENV)

// create connection to db, passing in MySQL info from .env
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
  });
} else {
  sequelize = new Sequelize(process.env.MYSQL_DATABASE, 'root', process.env.MYSQL_ROOT_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize;