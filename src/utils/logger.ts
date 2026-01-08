import pino, { HttpLogger } from 'pino-http';
import pretty from 'pino-pretty';
import { config } from './config';

function createLogger(): HttpLogger {
  const stream = pretty({ colorize: true });

  if (config.api.isProductionEnv) {
    return pino();
  }

  return pino(stream);
}

const loggerMiddleware = createLogger();
const logger = loggerMiddleware.logger;

export { logger, loggerMiddleware };
