import User from "models/user";
import env from "env";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

passport.use(User.createStrategy());
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_KEY
};
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

export default passport;
