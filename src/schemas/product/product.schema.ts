import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(50).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
});
