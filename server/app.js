const path = require('path');
// middleware for handling req res
const express = require('express');
// balls
const compression = require('compression');
const favicon = require('serve-favicon');
// for santa clause
const cookieParser = require('cookie-parser');
// for our pull request encodes for us
const bodyParser = require('body-parser');
// for schemas
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
// security measures we dont want application going stupid
const helmet = require('helmet');
// stopres session data and makes data accessable by session id
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// logging in and making server stateless
const redis = require('redis');
// middleware which auto genrates keys for each page and checks againgst forgery
const csrf = require('csurf');
const router = require('./router.js');
// grab our config file to access our variables
const config = require('./config.js');
// set up our ports and
const port = process.env.PORT || process.env.NODE_PORT || config.connections.http.port;
const dbURI = process.env.MONGODB_URI || config.connections.mongo;
const redisURL = process.env.REDISCLOUD_URL || config.connections.redis;

// setting up and connecting to our redis client
const redisClient = redis.createClient({
  legacyMode: true,
  url: redisURL,
});

redisClient.connect().catch(console.error);

// making sure we connect to our mongoose
mongoose.connect(dbURI, (err) => {
  if (err) {
    console.log('could not connect to database');
    throw err;
  }
});

// making sure we are using express for req res
const app = express();
// setting security parameters
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
// setting the assets directory
app.use('/assets', express.static(path.resolve(config.staticAssets.path)));
// setting favicon directory
app.use(favicon(path.resolve(`${config.staticAssets.path}/img/favicon.png`)));
// making sure we are using bodyParser for our posts
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// configure session make sure it uses redis this is what makes our server stateless
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
// setting our engine to handlebars
app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
// using the handlebars engine that was created for out views
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());
/// //////////////////////
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  console.log('Missin CSRF token!');
  return false;
});
/// ///////////////////////
router(app);

app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Listening on port ${port}`);
});
