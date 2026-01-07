import 'reflect-metadata';
import express from 'express';
import compression from 'compression';
import requestID from 'express-request-id';
import bodyParser from 'body-parser';

import { config, logger, loggerMiddleware } from './utils';
import { apiErrorHandlerMiddleware, configureGuards, customersRouter, ordersRouter, productsRouter } from './api';
import { initializeContainer } from './services';

async function main(): Promise<void> {
  await initializeContainer();
  const app = express()
    .use(loggerMiddleware, compression(), requestID(), bodyParser.json())
    .use('/v1/customers', customersRouter)
    .use('/v1/orders', ordersRouter)
    .use('/v1/products', productsRouter);
  configureGuards(app);
  app.use(apiErrorHandlerMiddleware);

  app.listen(config.api.port, () => {
    logger.info(`Server is running at http://localhost:${config.api.port}`);
  });
}

main();
