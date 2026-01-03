import 'reflect-metadata';
import express from 'express';
import compression from 'compression';
import requestID from 'express-request-id';
import bodyParser from 'body-parser';

import { config, logger, loggerMiddleware } from './utils';
import { customersRouter, productsRouter } from './api';

const app = express();

app
  .use(loggerMiddleware, compression(), requestID(), bodyParser.json())
  .use('/v1/customers', customersRouter)
  .use('/v1/products', productsRouter);

app.listen(config.api.port, () => {
  logger.info(`Server is running at http://localhost:${config.api.port}`);
});
