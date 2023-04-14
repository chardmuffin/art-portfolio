const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config({ path: '../.env' });

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;
// const bindingAddress = 'localhost';
const bindingAddress = '0.0.0.0';

app.use(session(sess)); // use express-session

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // enable CORS for all routes

app.use(routes); // turn on routes

// turn on connection to db and server
// edit to "force: true" if updating db models (will drop and recreate all tables)
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, bindingAddress, () => {
    console.log(`Now listening on ${bindingAddress}:${PORT}`);
  });
});