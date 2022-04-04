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
// uh oh spaghettios page not found
// middleware which auto genrates keys
// for each page and checks againgst forgery
const csrf = require('csurf');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';
const redisURL = process.env.REDISCLOUD_URL || 'redis://default:CJtKuvzE0sBTQ5pVPUThQWYCK3oxIyLJ@redis-16458.c98.us-east-1-4.ec2.cloud.redislabs.com:16458';

const redisClient = redis.createClient({
  legacyMode: true,
  url: redisURL,
});
redisClient.connect().catch(console.error);
mongoose.connect(dbURI, (err) => {
  if (err) {
    console.log('could not connect to database');
    throw err;
  }
});

const app = express();
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// configure session make sure it uses redis
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  console.log('Missin CSRF token!');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Listening on port ${port}`);
});
