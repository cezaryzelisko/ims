import bcrypt from 'bcrypt';
import { autoInjectable, inject } from 'tsyringe';
import { ICommandHandler } from '../interfaces';
import { RegisterCustomerCommand } from './register-customer.command';
import { CustomerModel, DomainError, DomainErrorsEnum } from '../../../domain';
import { logger } from '../../../utils';
import { InjectionTokens } from '../../injection-tokens';
import { IUnitOfWork } from '../../../unit-of-work';
import { customerRegistrationSchema } from '../../../schemas';
import { ValidationError } from 'joi';

@autoInjectable()
export class RegisterCustomerCommandHandler implements ICommandHandler<RegisterCustomerCommand, CustomerModel> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: RegisterCustomerCommand): Promise<CustomerModel | null> {
    logger.info(command.stringify());

    await this.validateInput(command);
    const isUsernameInUse = await this.unitOfWork!.customerRepository.existsByUsername(command.username);

    if (isUsernameInUse) {
      logger.warn(`[username=${command.username}] is already in use.`);
      return null;
    }

    const passwordHash = await bcrypt.hash(command.password, 10);
    let customer = new CustomerModel({ username: command.username, passwordHash });
    customer = await this.unitOfWork!.customerRepository.create(customer);

    return customer;
  }

  private async validateInput(command: RegisterCustomerCommand): Promise<void> {
    try {
      await customerRegistrationSchema.validateAsync({ username: command.username, password: command.password });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new DomainError(error?.message, DomainErrorsEnum.ValidationError, error?.details);
      }
    }
  }
}
