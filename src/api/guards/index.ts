import { Express } from 'express';
import passport from 'passport';
import { prepareUsernameAndPasswordGuard } from './local.strategy';
import { prepareJwtGuard } from './jwt.strategy';

export function configureGuards(app: Express): void {
  app.use(passport.use(prepareUsernameAndPasswordGuard()).use(prepareJwtGuard()).initialize());
}
