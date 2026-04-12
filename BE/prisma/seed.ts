import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

async function main() {
  const password = await bcrypt.hash("password123", saltRounds);

  await prisma.user.upsert({
    where: {
      email: "zafar@gmail.com",
    },
    update: {
      name: "Zafar Admin",
      password,
      role: "creator",
    },
    create: {
      email: "zafar@gmail.com",
      name: "Zafar Admin",
      password,
      role: "creator",
    },
  });

  console.log("Seeded user: zafar@gmail.com");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
