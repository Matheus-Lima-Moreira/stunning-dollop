import { User } from "@prisma/client";
import prisma from "../../prisma";

const ListUsersService = async (userLoggedInId?: number): Promise<User[]> => {

  const users = await prisma.user.findMany(
    {
      where: {
        id: {
          not: userLoggedInId
        }
      }
    }
  );

  return users;
};

export default ListUsersService