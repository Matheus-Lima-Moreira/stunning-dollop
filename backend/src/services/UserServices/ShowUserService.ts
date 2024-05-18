import { User } from "@prisma/client";
import prisma from "../../prisma"

const ShowUserService = async (id: string): Promise<User | null> => {

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  return user;
}

export default ShowUserService