import bcrypt from 'bcrypt';
import { autoInjectable, inject } from 'tsyringe';
import { RegisterCustomerCommand } from './register-customer.command';
import { CustomerModel, DomainError, DomainErrorsEnum } from '../../../domain';
import { logger } from '../../../utils';
import { InjectionTokens } from '../../common/injection-tokens';
import { IUnitOfWork } from '../../../unit-of-work';
import { customerRegistrationSchema } from '../../../schemas';
import { ValidationError } from 'joi';
import { IOperationHandler } from '../../common';

@autoInjectable()
export class RegisterCustomerCommandHandler implements IOperationHandler<RegisterCustomerCommand, CustomerModel> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: RegisterCustomerCommand): Promise<CustomerModel> {
    logger.info(command.stringify());

    await this.validateInput(command);
    const isUsernameInUse = await this.unitOfWork!.customerRepository.existsByUsername(command.username);

    if (isUsernameInUse) {
      const message = `[username=${command.username}] is already in use.`;
      logger.warn(message);
      throw new DomainError(message, DomainErrorsEnum.NotAllowedError);
    }

    const passwordHash = await bcrypt.hash(command.password, 10);
    let customer = new CustomerModel({ username: command.username, passwordHash, region: command.region });
    customer = await this.unitOfWork!.customerRepository.persist(customer);

    return customer;
  }

  private async validateInput(command: RegisterCustomerCommand): Promise<void> {
    try {
      await customerRegistrationSchema.validateAsync({
        username: command.username,
        password: command.password,
        region: command.region,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new DomainError(error?.message, DomainErrorsEnum.ValidationError, error?.details);
      }
    }
  }
}
