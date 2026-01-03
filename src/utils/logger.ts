import pino, { HttpLogger } from 'pino-http';
import * as pretty from 'pino-pretty';

export function createLogger(isProductionEnv: boolean): HttpLogger {
  const stream = pretty({ colorize: true });

  if (isProductionEnv) {
    return pino();
  }

  return pino(stream);
}
