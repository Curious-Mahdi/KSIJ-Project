const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst();
  if (!admin) {
    console.log("No user found.");
    return;
  }
  
  // Create Khoja Masjid Dongri Hall
  await prisma.communityProperty.create({
    data: {
      name: "Khoja Masjid Dongri Hall",
      propertyType: "Hall / Venue",
      shortDescription: "A beautiful, fully air-conditioned banquet hall perfect for weddings, majlis, and community events.",
      description: "The Khoja Masjid Dongri Hall offers a state-of-the-art facility for community members to host weddings, receptions, majlis, and other social gatherings. It features a spacious layout, dedicated dining areas, and modern amenities.",
      managedById: admin.id,
      address: "123 Dongri Road",
      area: "Dongri",
      city: "Mumbai",
      location: "Dongri, Mumbai",
      usageTags: "Weddings,Majlis,Receptions,Community Events",
      facilities: "Air Conditioning,Stage,Dining Area,Audio System,Kitchen",
      capacity: 500,
      pricing: "₹50,000 for 3 hours",
      pricingDetails: "Base rate is ₹50,000 for 3 hours. Additional hours at ₹10,000/hr.",
      functionTimings: "Morning: 10AM-2PM | Evening: 6PM-11PM",
      contactInformation: "Khoja Jamaat Office: +91 9876543210",
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000", sortOrder: 1 },
          { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1000", sortOrder: 2 },
          { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000", sortOrder: 3 }
        ]
      }
    }
  });

  console.log("Seeded Khoja Masjid Dongri Hall.");
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
