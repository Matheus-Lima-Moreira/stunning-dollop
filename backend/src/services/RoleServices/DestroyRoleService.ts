import prisma from "../../prisma"

const DestroyRoleService = async (id: string): Promise<void> => {

  await prisma.role.delete({
    where: {
      id: parseInt(id),
      AND: {
        users: {
          none: {}
        }
      }
    }
  });

  return;
}

export default DestroyRoleService