import { Express } from 'express';
import passport from 'passport';
import { prepareUsernameAndPasswordGuard } from './local.strategy';

export function configureGuards(app: Express): void {
  passport.use(prepareUsernameAndPasswordGuard());
  app.use(passport.initialize());
}
