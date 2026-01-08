import Joi from 'joi';
import { RegionEnum } from '../../domain';

export const customerRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
  region: Joi.string()
    .valid(...Object.values(RegionEnum))
    .required(),
});
