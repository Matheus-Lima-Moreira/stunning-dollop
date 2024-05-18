import { User } from "@prisma/client";
import authConfig from "../config/auth";
import { sign } from "jsonwebtoken";

interface Response {
  token: string;
  refreshToken: string;
}

export const CreateTokens = (user: User): Response => {
  const { secret, expiresIn, refreshSecret, refreshExpiresIn } = authConfig;

  const token = sign(
    {
      username: user.name,
      id: user.id
    },
    secret,
    { expiresIn }
  );

  const refreshToken = sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: refreshExpiresIn }
  );

  return {
    token,
    refreshToken
  }
};