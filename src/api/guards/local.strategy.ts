import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { container } from 'tsyringe';
import { InjectionTokens } from '../../services';
import { IUnitOfWork } from '../../unit-of-work';

export function prepareUsernameAndPasswordGuard(): Strategy {
  return new Strategy(async (username, password, done) => {
    const unitOfWork = container.resolve<IUnitOfWork>(InjectionTokens.UnitOfWork);

    const customer = await unitOfWork.customerRepository.findByUsername(username);

    if (!customer) {
      return done(null, false);
    } else if (customer.passwordHash) {
      const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);

      if (!isPasswordValid) {
        return done(null, false);
      }
    }

    return done(null, customer.toContextModel());
  });
}
