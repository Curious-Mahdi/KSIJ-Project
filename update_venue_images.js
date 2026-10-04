const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find Mehfil
  const mehfil = await prisma.communityProperty.findFirst({
    where: { name: { contains: "Mehfil" } },
    include: { images: true }
  });

  if (mehfil) {
    // Delete old images
    await prisma.communityPropertyImage.deleteMany({
      where: { propertyId: mehfil.id }
    });
    
    // Add new image (Islamic Architecture / Mosque)
    await prisma.communityPropertyImage.create({
      data: {
        propertyId: mehfil.id,
        url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1000",
        sortOrder: 1
      }
    });
    console.log("Updated image for Mehfil-e-Mustafa");
  }

  // Find Arambag
  const arambag = await prisma.communityProperty.findFirst({
    where: { name: { contains: "Arambag" } },
    include: { images: true }
  });

  if (arambag) {
    // Delete old images
    await prisma.communityPropertyImage.deleteMany({
      where: { propertyId: arambag.id }
    });
    
    // Add new image (Islamic Architecture / Mosque)
    await prisma.communityPropertyImage.create({
      data: {
        propertyId: arambag.id,
        url: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1000",
        sortOrder: 1
      }
    });
    console.log("Updated image for Arambag");
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
