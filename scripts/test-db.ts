import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email: "admin@upscale.com" },
  });
  console.log(user);
  await prisma.$disconnect();
}

main().catch(console.error);
