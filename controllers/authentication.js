const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signup = (req, res, next) => {
  validateUserFields(req.body);

  User.findOne({ email: req.body.email }, (error, existingUser) => {
    if (error) {
      return next(error);
    }

    if (existingUser) {
      return res.status(422).send({ error: "Email is already in use" });
    }

    createNewUser(res, req.body);
  });
};

const validateUserFields = ({ email, password, name }) => {
  if (!email || !password || !name) {
    return res.status(422).send({ error: "Missing fields" });
  }
};

const createNewUser = (res, userData) => {
  const user = new User(userData);

  user.save((error) => {
    if (error) {
      return next(error);
    }

    res.json({ token: tokenForUser(user) });
  });
};

exports.signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};
