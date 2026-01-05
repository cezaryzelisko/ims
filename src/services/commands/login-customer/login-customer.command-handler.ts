import bcrypt from 'bcrypt';
import { autoInjectable, inject } from 'tsyringe';
import { LoginCustomerCommand } from './login-customer.command';
import { CustomerModel } from '../../../domain';
import { logger } from '../../../utils';
import { InjectionTokens } from '../../common/injection-tokens';
import { IUnitOfWork } from '../../../unit-of-work';
import { IOperationHandler } from '../../common';

@autoInjectable()
export class LoginCustomerCommandHandler implements IOperationHandler<LoginCustomerCommand, CustomerModel | null> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: LoginCustomerCommand): Promise<CustomerModel | null> {
    logger.info(command.stringify());

    const customer = await this.unitOfWork!.customerRepository.getByUsername(command.username);

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
