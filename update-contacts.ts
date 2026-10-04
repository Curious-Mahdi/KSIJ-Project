import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.directoryListing.findMany();
  
  let femaleSkippedCount = 0;
  
  for (const listing of listings) {
    // Basic deterministic fake number
    const hash = listing.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const prefix = ['98', '99', '88', '77', '91', '81'][hash % 6];
    const rest = (10000000 + (hash * 12345 % 89999999)).toString();
    const fakePhone = '+91 ' + prefix + ' ' + rest.substring(0, 4) + ' ' + rest.substring(4, 8);
    
    let assignNumber = true;
    
    // For 1 or 2 female people, don't add the number
    if (femaleSkippedCount < 2 && (listing.name.toLowerCase().includes('fatima') || listing.name.toLowerCase().includes('zainab') || listing.name.toLowerCase().includes('zahra') || listing.name.toLowerCase().includes('maryam') || listing.name.toLowerCase().includes('sara') || hash % 10 === 7)) {
       assignNumber = false;
       femaleSkippedCount++;
    }
    
    await prisma.directoryContact.upsert({
      where: { listingId: listing.id },
      update: {
        phone: assignNumber ? fakePhone : null,
        whatsapp: assignNumber ? fakePhone : null,
      },
      create: {
        listingId: listing.id,
        phone: assignNumber ? fakePhone : null,
        whatsapp: assignNumber ? fakePhone : null,
      }
    });
  }
  
  console.log('Contacts updated!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
