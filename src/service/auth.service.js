import { Op } from "sequelize";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const AuthService = {
  async checkLogin(email, password) {
    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { username: email }],
        },
      });

      if (!user) {
        return false;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return false;
      }
      const { id, username, fullName, avatar, role } = user;

      return { id, username, fullName, avatar, role };
    } catch (error) {
      console.error("Error checking login:", error);
      return false;
    }
  },

  async signup(user) {
    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email: user.email }, { username: user.username }],
        },
      });
      if (existingUser) {
        return false;
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const newUser = await User.create({ ...user, role: "user" });
      const { id, username, fullName, avatar, role } = newUser;
      return { id, username, fullName, avatar, role };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },
};

export default AuthService;
