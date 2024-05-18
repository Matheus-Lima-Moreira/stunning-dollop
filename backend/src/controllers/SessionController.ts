import { Request, Response } from "express";
import AuthUserService from "../services/AuthServices/AuthUserService";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
import { logger } from "../utils/logger";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid or missing email" });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Invalid or missing password." });
  }

  try {
    const { token, refreshToken, user } = await AuthUserService(email, password);

    SendRefreshToken(res, refreshToken);

    return res.status(200).json({
      token,
      user
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {

  return res.json({ message: "Register successful!" });
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie("jrt");

  req.session.destroy((err) => {
    if (err) {
      logger.error(err);
      return res.status(500).json({ message: "Logout failed!" });
    }
  });

  return res.json({ message: "Logout successful!" });
};