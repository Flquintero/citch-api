import * as express from 'express';
const auth = require('./api/auth');

module.exports = function (app: any) {
  app.use(express.json());
  app.use('/auth', auth);
};
