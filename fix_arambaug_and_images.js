const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Fix Arambag spelling to Arambaug
  const arambag = await prisma.communityProperty.findFirst({
    where: { name: { contains: "Arambag" } }
  });

  if (arambag) {
    await prisma.communityProperty.update({
      where: { id: arambag.id },
      data: {
        name: "Arambaug (Mazgaon Imambada)"
      }
    });
    console.log("Renamed Arambag to Arambaug");

    // Remove images for Arambaug
    await prisma.communityPropertyImage.deleteMany({
      where: { propertyId: arambag.id }
    });
    console.log("Removed images for Arambaug");
  }

  // 2. Remove images for Mehfil-e-Mustafa (Kapaswadi)
  const mehfil = await prisma.communityProperty.findFirst({
    where: { name: { contains: "Mehfil" } }
  });

  if (mehfil) {
    await prisma.communityPropertyImage.deleteMany({
      where: { propertyId: mehfil.id }
    });
    console.log("Removed images for Mehfil-e-Mustafa (Kapaswadi)");
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
