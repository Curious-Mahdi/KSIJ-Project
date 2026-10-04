const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find Mehfil
  const mehfil = await prisma.communityProperty.findFirst({
    where: { name: { contains: "Mehfil" } }
  });

  if (mehfil) {
    await prisma.communityPropertyImage.create({
      data: {
        propertyId: mehfil.id,
        url: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&q=80&w=1000",
        sortOrder: 1
      }
    });
    console.log("Added image to Mehfil-e-Mustafa");
  }

  // Find Arambag
  const arambag = await prisma.communityProperty.findFirst({
    where: { name: { contains: "Arambag" } }
  });

  if (arambag) {
    await prisma.communityPropertyImage.create({
      data: {
        propertyId: arambag.id,
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
        sortOrder: 1
      }
    });
    console.log("Added image to Arambag");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
