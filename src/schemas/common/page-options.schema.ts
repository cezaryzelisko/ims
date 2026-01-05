import Joi from 'joi';

export const pageOptionsSchema = Joi.object({
  limit: Joi.number().min(0).max(50),
  offset: Joi.number().min(0),
});
