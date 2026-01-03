import * as express from 'express';
import * as compression from 'compression';

import { createLogger } from './utils/logger';
import { config } from './utils/config';

const app = express();
const logger = createLogger(config.api.isProductionEnv);

app.use(logger, compression());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(config.api.port, () => {
  logger.logger.info(`Server is running at http://localhost:${config.api.port}`);
});
