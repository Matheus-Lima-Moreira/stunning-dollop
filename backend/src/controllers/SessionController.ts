import { Request, Response } from "express";
import AuthUserService from "../services/AuthServices/AuthUserService";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
import { logger } from "../utils/logger";
import { RefreshTokenService } from "../services/AuthServices/RefreshTokenService";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "E-mail está inválido." });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Senha está inválida." });
  }

  try {
    const { token, refreshToken, user } = await AuthUserService(email, password);

    SendRefreshToken(res, refreshToken);

    req.session.user = user;
    req.session.save();

    return res.status(200).json({
      token,
      user
    });
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ message: "Credenciais inválidas." });
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token: string = req?.cookies?.jrt;

  if (!token) {
    return res.status(401).json({ message: "Sessão expirada. Por favor, faça login novamente." });
  }

  const { user, newToken, refreshToken } = await RefreshTokenService(res, token);

  SendRefreshToken(res, refreshToken);

  return res.json({
    token: newToken,
    user
  });
};

export const register = async (req: Request, res: Response): Promise<Response> => {

  return res.json({ message: "Registro realizado com sucesso!" });
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie("jrt");

  req.session.destroy((err) => {
    if (err) {
      logger.error(err);
      return res.status(500).json({ message: "Logout falhou!" });
    }
  });

  return res.json({ message: "Deslogado com sucesso!" });
};