var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'webapp'
    },
    port: 3000,
    db: 'mongodb://localhost/webapp-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'webapp'
    },
    port: 3000,
    db: 'mongodb://localhost/webapp-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'webapp'
    },
    port: 3000,
    db: 'mongodb://localhost/webapp-production'
  }
};

module.exports = config[env];
