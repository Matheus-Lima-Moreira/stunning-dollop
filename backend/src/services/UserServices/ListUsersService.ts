import { User } from "@prisma/client";
import prisma from "../../prisma";

const ListUsersService = async (): Promise<User[]> => {

  const users = await prisma.user.findMany();

  return users;
};

export default ListUsersService