require('dotenv').config();

const staticAssets = {
  development: {
    path: 'hosted/',
  },
  production: {
    path: 'hosted/',
  },
};

const connections = {
  development: {
    http: {
      port: 3000,
    },
    mongo: process.env.MONGODB_URI || 'mongodb://127.0.0.1/TaskBoard',
    redis: process.env.REDISCLOUD_URL,
  },

  production: {
    http: {
      port: process.env.PORT || process.env.NODE_PORT || 3000,
    },
    mongo: process.env.MONGODB_URI,
    redis: process.env.REDISCLOUD_URL,
  },
};

/* Once we have setup the map objects above, we can simply export the ones
   relevant to our specific dev environment. In the case of our secret, it
   will always just be the one we are importing from our .env file.
*/
module.exports = {
  staticAssets: staticAssets[process.env.NODE_ENV],
  connections: connections[process.env.NODE_ENV],
  secret: process.env.SECRET,
};
