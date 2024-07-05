import prisma from "../../prisma";

interface ICreateUser {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

const CreateUserService = async (userData: ICreateUser) => {
  const { name, email, password, roleId } = userData;

  const userCreated = await prisma.user.create({
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

  return userCreated;
}

export default CreateUserService