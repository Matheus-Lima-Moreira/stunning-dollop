import prisma from "../../prisma";

interface IUpdateRole {
  id: string;
  name: string;
  permissions: string[];
}

const UpdateRoleService = async (roleData: IUpdateRole) => {
  const { id, name, permissions } = roleData;

  const roleUpdated = await prisma.role.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name,
      permissions: {
        deleteMany: {},
        create: permissions.map(permission => ({
          name: permission
        }))
      }
    },
    include: {
      permissions: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return roleUpdated;
}

export default UpdateRoleService