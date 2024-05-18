import prisma from "../../prisma";

interface IUpdateUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const UpdateUserService = async (userData: IUpdateUser) => {
  const { id, name, email, password } = userData;

  const userUpdated = await prisma.user.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name,
      email,
      password
    }
  });

  return userUpdated;
}

export default UpdateUserService