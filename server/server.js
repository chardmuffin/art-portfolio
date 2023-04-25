const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config({ path: '../.env' });

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: process.env.SECRET,
  cookie: { maxAge: 3600000 },
  resave: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
  proxy: true
};

const app = express();
const PORT = process.env.PORT || 3001;
// const bindingAddress = 'localhost';
const bindingAddress = '0.0.0.0';

app.use(session(sess)); // use express-session

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS for all routes
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};
app.use(cors(corsOptions));

app.use(routes); // turn on routes

// turn on connection to db and server
// edit to "force: true" if updating db models (will drop and recreate all tables)
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, bindingAddress, () => {
    console.log(`Now listening on ${bindingAddress}:${PORT}`);
  });
});