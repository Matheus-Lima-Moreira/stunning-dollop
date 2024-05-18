import prisma from "../../prisma";

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

const CreateUserService = async (userData: ICreateUser) => {
  const { name, email, password } = userData;

  const userCreated = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  return userCreated;
}

export default CreateUserService