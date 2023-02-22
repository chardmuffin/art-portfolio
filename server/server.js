const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // enable CORS for all routes

app.use(routes); // turn on routes

// turn on connection to db and server
// edit to "force: true" if updating db models (will drop and recreate all tables)
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});