import { JWT_SECRET } from "../config/config.js";
import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.checkLogin(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `An error occurred during login! ${error}.`,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.checkLogin(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not admin",
      });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `An error occurred during login! ${error}.`,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const user = await AuthService.signup(req.body);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Signup failed. Email or username already exists",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Signup successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Signup failed ${error?.message}`,
      error: `An error occurred during signup! ${error}.`,
    });
  }
};