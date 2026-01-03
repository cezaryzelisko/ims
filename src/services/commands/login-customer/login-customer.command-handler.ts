import bcrypt from 'bcrypt';
import { autoInjectable, inject } from 'tsyringe';
import { ICommandHandler } from '../interfaces';
import { LoginCustomerCommand } from './login-customer.command';
import { CustomerModel } from '../../../domain';
import { logger } from '../../../utils';
import { InjectionTokens } from '../../injection-tokens';
import { IUnitOfWork } from '../../../unit-of-work';

@autoInjectable()
export class LoginCustomerCommandHandler implements ICommandHandler<LoginCustomerCommand, CustomerModel | null> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: LoginCustomerCommand): Promise<CustomerModel | null> {
    logger.info(command.stringify());

    const customer = await this.unitOfWork!.customerRepository.findByUsername(command.username);

    if (!customer) {
      return null;
    } else if (customer.passwordHash) {
      const isPasswordValid = await bcrypt.compare(command.password, customer.passwordHash);

      if (!isPasswordValid) {
        return null;
      }
    }

    return customer.toContextModel();
  }
}
