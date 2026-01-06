import Joi from 'joi';

export const productStockSchema = Joi.object({
  count: Joi.number().min(1).required(),
});
