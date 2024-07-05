import { Role } from "@prisma/client";
import prisma from "../../prisma"

const ShowRoleService = async (id: string): Promise<Role | null> => {

  const role = await prisma.role.findUnique({
    where: {
      id: parseInt(id)
    },
    include: {
      permissions: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  return role;
}

export default ShowRoleService