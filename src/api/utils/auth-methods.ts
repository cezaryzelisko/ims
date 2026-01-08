import passport from 'passport';

export const localAuth = passport.authenticate('local', { session: false });
export const jwtAuth = passport.authenticate('jwt', { session: false });
