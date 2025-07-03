import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

setTimeout(async () => {
  async function main() {
    // 1. Компанија
    const company = await prisma.company.create({
      data: {
        name: "Rent Hub Group",
        description: "Premium car & apartment rentals.",
      },
    });

    // 2. COMPANY корисник
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@renthub.com",
        password: await hash("password123", 10),
        fullName: "Company Admin",
        role: "COMPANY",
        companyId: company.id,
      },
    });

    // 3. Обичен корисник
    const normalUser = await prisma.user.create({
      data: {
        email: "user@renthub.com",
        password: await hash("userpass123", 10),
        fullName: "Normal User",
        role: "USER",
      },
    });

    // 4. Коли
    const car1 = await prisma.car.create({
      data: {
        model: "A4",
        brand: "Audi",
        year: 2022,
        pricePerDay: 65,
        companyId: company.id,
        images: {
          create: [
            { url: "https://example.com/audi-a4-front.jpg" },
            { url: "https://example.com/audi-a4-side.jpg" },
          ],
        },
      },
    });

    const car2 = await prisma.car.create({
      data: {
        model: "Model 3",
        brand: "Tesla",
        year: 2023,
        pricePerDay: 120,
        companyId: company.id,
        images: {
          create: [{ url: "https://example.com/tesla-model3-front.jpg" }],
        },
      },
    });

    // 5. Апартмани
    const apt1 = await prisma.apartment.create({
      data: {
        title: "Sea View Apartment",
        location: "Ohrid",
        pricePerNight: 80,
        companyId: company.id,
        images: {
          create: [
            { url: "https://example.com/ohrid-sea1.jpg" },
            { url: "https://example.com/ohrid-sea2.jpg" },
          ],
        },
      },
    });

    const apt2 = await prisma.apartment.create({
      data: {
        title: "Skopje City Flat",
        location: "Skopje",
        pricePerNight: 55,
        companyId: company.id,
        images: {
          create: [{ url: "https://example.com/skopje-flat.jpg" }],
        },
      },
    });

    console.log("🌱 Seed finished successfully!");
    console.log(`Created company: ${company.name}`);
    console.log(`Created users: ${adminUser.email}, ${normalUser.email}`);
    console.log(
      `Created cars: ${car1.brand} ${car1.model}, ${car2.brand} ${car2.model}`
    );
    console.log(`Created apartments: ${apt1.title}, ${apt2.title}`);
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}, 100);
