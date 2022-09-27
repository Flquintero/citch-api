import * as express from 'express';
const auth = require('./api/auth');
const users = require('./api/users');
const organizations = require('./api/organizations');
const facebook = require('./api/facebook');

module.exports = function (app: express.Application) {
  app.use(express.json());
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/organizations', organizations);
  app.use('/facebook', facebook);
};
