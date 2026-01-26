import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const hashedAdminPassword = await bcrypt.hash("berkerMETEHAN", 10);
  const admin = await prisma.user.upsert({
    where: { username: "havanadigitalofficial" },
    update: {},
    create: {
      username: "havanadigitalofficial",
      password: hashedAdminPassword,
      firstName: "Havana",
      lastName: "Admin",
      companyName: "Havana Digital",
      role: "ADMIN",
      isActive: true
    }
  });
  console.log("Admin user created:", admin.username);

  // Test user (john@doe.com)
  const hashedTestPassword = await bcrypt.hash("johndoe123", 10);
  const testUser = await prisma.user.upsert({
    where: { username: "john@doe.com" },
    update: {},
    create: {
      username: "john@doe.com",
      password: hashedTestPassword,
      firstName: "John",
      lastName: "Doe",
      companyName: "Test Company",
      role: "ADMIN",
      isActive: true
    }
  });
  console.log("Test user created:", testUser.username);

  // Categories
  const categories = [
    { name: "Dashboard Kullanımı", icon: "📊", slug: "dashboard-kullanimi", order: 1 },
    { name: "Satış Stratejileri", icon: "💰", slug: "satis-stratejileri", order: 2 },
    { name: "Veri Analizi", icon: "📈", slug: "veri-analizi", order: 3 },
    { name: "Pazarlama İpuçları", icon: "🎯", slug: "pazarlama-ipuclari", order: 4 },
    { name: "Sistem Ayarları", icon: "⚙️", slug: "sistem-ayarlari", order: 5 }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  console.log("Categories created:", categories.length);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
