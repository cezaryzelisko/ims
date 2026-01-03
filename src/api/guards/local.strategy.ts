import { Strategy } from 'passport-local';
import { container } from 'tsyringe';
import { InjectionTokens } from '../../services';
import { CommandBus } from '../../services/commands/command-bus';
import { LoginCustomerCommand } from '../../services/commands/login-customer/login-customer.command';

export function prepareUsernameAndPasswordGuard(): Strategy {
  return new Strategy({ passReqToCallback: true }, async (req, username, password, done) => {
    const commandBus = container.resolve<CommandBus>(InjectionTokens.CommandBus);
    const customer = await commandBus.execute(new LoginCustomerCommand(req.id.toString(), username, password));

    if (!customer) {
      return done(null, false, { message: 'Invalid username or password' });
    }

    return done(null, customer);
  });
}
