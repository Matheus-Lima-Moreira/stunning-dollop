import { User } from "@prisma/client";
import { Response as res } from "express";
import { verify } from "jsonwebtoken";
import ShowUserService from "../UserServices/ShowUserService";
import authConfig from "../../config/auth";
import { CreateTokens } from "../../helpers/CreateTokens";

interface RefreshTokenPayload {
  id: string;
}

interface Response {
  user: User | null;
  newToken: string;
  refreshToken: string;
}

export const RefreshTokenService = async (
  res: res,
  token: string
): Promise<Response> => {
  try {
    const decoded = verify(token, authConfig.refreshSecret);
    const { id } = decoded as RefreshTokenPayload;

    const user = await ShowUserService(id);

    if (!user) {
      res.clearCookie("jrt");
      return { user: null, newToken: "", refreshToken: "" };
    }

    const { token: newToken, refreshToken } = CreateTokens(user);

    return { user, newToken, refreshToken };
  } catch (err) {
    res.clearCookie("jrt");
    return { user: null, newToken: "", refreshToken: "" };
  }
};
