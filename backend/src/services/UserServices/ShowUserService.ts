import { User } from "@prisma/client";
import prisma from "../../prisma"

const ShowUserService = async (id: string): Promise<User | null> => {

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  return user;
}

export default ShowUserService