import { NextFunction, Request, Response } from "express";
import authConfig from "../config/auth";
import { verify } from "jsonwebtoken";

const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Invalid access token. Please provide a valid token" });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    verify(token, authConfig.secret);
  } catch (err) {
    res.status(401).json({ message: "Invalid access token. Please provide a valid token" });
    return;
  }

  return next();
};

export default isAuth;