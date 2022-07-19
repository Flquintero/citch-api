import * as express from 'express';
const auth = require('./api/auth');
const users = require('./api/users');

module.exports = function (app: express.Application) {
  app.use(express.json());
  app.use('/auth', auth);
  app.use('/users', users);
};
