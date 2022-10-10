const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const LocalStrategy = require("passport-local");

const createJwtLoginStrategy = (payload, done) => {
  User.findOne({ id: payload.sub }, (error, user) => {
    if (error) {
      return done(error, false);
    }

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  });
};

const jwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};

const jwtLoginStrategy = new JwtStrategy(
  jwtStrategyOptions,
  createJwtLoginStrategy
);

const createLocalLoginStrategy = (email, password, done) => {
  User.findOne({ email }, (error, user) => {
    if (error) {
      return done(error, false);
    }

    if (!user) {
      return done(null, false);
    }

    user.comparePassword(password, (error, isMatch) => {
      if (error) {
        return done(error);
      }

      if (isMatch) {
        return done(null, user);
      }

      return done(null, false);
    });
  });
};

const localStrategyOptions = { usernameField: "email" };

const localLoginStrategy = new LocalStrategy(
  localStrategyOptions,
  createLocalLoginStrategy
);

passport.use(jwtLoginStrategy);
passport.use(localLoginStrategy);
