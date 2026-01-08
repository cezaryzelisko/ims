import jwt from 'jsonwebtoken';
import { CustomerModel } from '../../domain';
import { CustomerLoginDto, CustomerPayloadDto } from '../dtos';
import { config } from '../../utils';

export function signCustomer(customer: CustomerModel): CustomerLoginDto {
  return CustomerLoginDto.fromDomain(customer, jwt.sign(CustomerPayloadDto.fromDomain(customer), config.api.secret));
}
