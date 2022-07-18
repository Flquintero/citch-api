import * as express from 'express';
const auth = require('./api/auth');

module.exports = function (app: express.Application) {
  app.use(express.json());
  app.use('/auth', auth);
};
