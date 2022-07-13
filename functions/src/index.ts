import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

const app = express();
// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

import * as cors from 'cors';
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());

import * as bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// const apiRouteV1 = require('./api/v1');
// app.use('/api/v1', apiRouteV1);
require('./routes')(app);

exports.api = functions.https.onRequest(app);
