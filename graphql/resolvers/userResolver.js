const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "10days" }
  );
};

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is already taken", {
          errors: { username: "username is already taken" },
        });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        token,
        ...res._doc,
        id: res._id,
      };
    },

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Invalid password";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      const token = generateToken(user);

      return {
        token,
        ...user._doc,
        id: user._id,
      };
    },
  },
};
