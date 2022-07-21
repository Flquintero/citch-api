import 'dotenv/config';
import * as express from 'express';
require('./config/firebase');
import { functions } from './config/firebase';

const app = express();

// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Types
import { IError } from './types/general/errors';

import * as cors from 'cors';
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'https://www.citch.io'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app);

function errorHandler(
  err: IError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log('err', err.message);
  // need status to get error correctly in front end
  // need to structure errors before sending here One for generic and one for each platform
  res.status(err.code).json(err);
}
app.use(errorHandler);

exports.api = functions.https.onRequest(app);
