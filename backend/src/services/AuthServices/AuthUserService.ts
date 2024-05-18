import { User } from "@prisma/client";
import prisma from "../../prisma";
import { CreateTokens } from "../../helpers/CreateTokens";

interface Response {
  token: string;
  refreshToken: string;
  user: User;
}

const AuthUserService = async (email: string, password: string): Promise<Response> => {

  const user = await prisma.user.findFirst({
    where: {
      email,
      password
    }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const { token, refreshToken } = CreateTokens(user);

  return {
    user,
    token,
    refreshToken
  };
};

export default AuthUserService;