import { NextFunction, Request, Response } from "express";
import authConfig from "../config/auth";
import { verify } from "jsonwebtoken";
import ShowUserService from "../services/UserServices/ShowUserService";

interface TokenPayload {
  id: string;
  username: string;
}

const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token de acesso inválido. Por favor, forneça um token válido" });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.secret);
    const { id } = decoded as TokenPayload;

    const user = await ShowUserService(id);

    req.session.user = user || undefined;
    req.session.save();

  } catch (err) {
    res.status(401).json({ message: "Token de acesso inválido. Por favor, forneça um token válido" });
    return;
  }

  return next();
};

export default isAuth;