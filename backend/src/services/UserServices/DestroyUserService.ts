import prisma from "../../prisma"

const DestroyUserService = async (id: string): Promise<void> => {

  await prisma.user.delete({
    where: {
      id: parseInt(id)
    }
  });

  return;
}

export default DestroyUserService