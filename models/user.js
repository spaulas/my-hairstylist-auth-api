const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const preSaveNewUser = (user, next) => {
  bcrypt.genSalt(10, (error, salt) =>
    generateBcryptSalt({ error, salt, next, user })
  );
};

const generateBcryptSalt = ({ error, salt, next, user }) => {
  if (error) {
    return next(error);
  }

  bcrypt.hash(user.password, salt, null, (error, hash) =>
    hashPassword({ error, hash, next, user })
  );
};

const hashPassword = ({ error, hash, next, user }) => {
  if (error) {
    return next(error);
  }

  user.password = hash;
  next();
};

userSchema.pre("save", function (next) {
  preSaveNewUser(this, next);
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
    if (error) {
      return callback(error);
    }

    return callback(null, isMatch);
  });
};

const ModelClass = mongoose.model("user", userSchema);
module.exports = ModelClass;
