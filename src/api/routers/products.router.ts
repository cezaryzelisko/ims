import { Router } from 'express';
import { jwtAuth } from '../utils';

export const productsRouter = Router();

productsRouter.get('/', jwtAuth, async (req, res) => {
  res.json([]);
});
