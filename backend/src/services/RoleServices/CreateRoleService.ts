import prisma from "../../prisma";

interface ICreateRole {
  name: string;
  permissions: string[];
}

const CreateRoleService = async (roleData: ICreateRole) => {
  const { name, permissions } = roleData;

  const roleCreated = await prisma.role.create({
    data: {
      name,
      permissions: {
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

  return roleCreated;
}

export default CreateRoleService