import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '../../utils';
import { container } from 'tsyringe';
import { IUnitOfWork } from '../../unit-of-work';
import { InjectionTokens } from '../../services';
import { CustomerPayloadDto } from '../dtos';

export function prepareJwtGuard(): Strategy {
  return new Strategy(
    {
      secretOrKey: config.api.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: CustomerPayloadDto, done) => {
      const unitOfWork = container.resolve<IUnitOfWork>(InjectionTokens.UnitOfWork);
      const customer = await unitOfWork.customerRepository.findById(payload.id);

      if (!customer) {
        return done(null, false);
      }

      return done(null, customer.toContextModel());
    },
  );
}
