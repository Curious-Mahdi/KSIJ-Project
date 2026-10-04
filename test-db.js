const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.directoryListing.count();
  console.log('Count:', count);
}
main();
