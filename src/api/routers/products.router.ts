import { Router } from 'express';

export const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  res.json([]);
});
