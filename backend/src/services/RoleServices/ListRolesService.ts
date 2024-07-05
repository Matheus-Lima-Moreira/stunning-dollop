import { Role } from "@prisma/client";
import prisma from "../../prisma";

const ListRolesService = async (): Promise<Role[]> => {

  const roles = await prisma.role.findMany(
    {
      include: {
        permissions: {
          select: {
            id: true,
            name: true
          },          
        }
      }
    }
  );

  return roles;
};

export default ListRolesService