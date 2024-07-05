import prisma from "../../prisma";

interface IUpdateUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: number;
}

const UpdateUserService = async (userData: IUpdateUser) => {
  const { id, name, email, password, roleId } = userData;

  const userUpdated = await prisma.user.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name,
      email,
      password,
      roleId
    },
    include: {
      role: {
        include: {
          permissions: true
        }
      }
    }
  });

  return userUpdated;
}

export default UpdateUserService