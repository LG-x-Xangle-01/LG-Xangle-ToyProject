import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkUserExists = async (nickname) => {
  const user = await prisma.user.findMany({
    where: {nickname}
  })
  return !!user.length
}

export default prisma;