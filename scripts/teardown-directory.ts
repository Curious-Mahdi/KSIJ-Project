import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Tearing down fake directory data...");

  // Find the fake users
  const fakeUsers = await prisma.user.findMany({
    where: {
      email: {
        in: [
          'fakeuser1@example.com',
          'fakeuser2@example.com',
          'fakeuser3@example.com',
          'fakeuser4@example.com',
          'fakeuser5@example.com',
        ]
      }
    }
  });

  const fakeUserIds = fakeUsers.map(u => u.id);

  if (fakeUserIds.length > 0) {
    // Delete listings owned by fake users (this cascades to contacts & conversations & messages)
    const deletedListings = await prisma.directoryListing.deleteMany({
      where: { ownerId: { in: fakeUserIds } }
    });
    console.log(`Deleted ${deletedListings.count} fake listings.`);

    // Delete fake users
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: fakeUserIds } }
    });
    console.log(`Deleted ${deletedUsers.count} fake users.`);
  } else {
    console.log("No fake data found to delete.");
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
