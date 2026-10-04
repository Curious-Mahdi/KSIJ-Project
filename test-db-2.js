const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const listings = await prisma.directoryListing.findMany({ select: { name: true, category: true, subcategory: true, services: true } });
  console.log(listings);
}
main();
