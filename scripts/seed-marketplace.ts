import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Marketplace and Community Properties...');

  let admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!admin) {
    admin = await prisma.user.findFirst();
  }

  if (!admin) {
    console.error("No users found to act as owner.");
    return;
  }

  // Clear existing seeded data to avoid duplicates
  await prisma.communityProperty.deleteMany({ where: { managedById: admin.id } });
  await prisma.marketplaceListing.deleteMany({ where: { sellerId: admin.id } });

  // 1. Seed Community Properties (Venues, Halls, etc)
  const communityProperties = [
    {
      name: "Jamaat Main Hall (Imambargah)",
      propertyType: "Hall / Venue",
      location: "Dongri, Mumbai",
      city: "Mumbai",
      capacity: 800,
      shortDescription: "The primary community hall located in the heart of Dongri, perfect for large events.",
      description: "The primary community hall located in the heart of Dongri. This spacious, fully air-conditioned venue is perfect for large religious gatherings, Majalis, Nikah ceremonies, and Walima dinners. It includes separate entrances for ladies and gents, a fully equipped industrial kitchen for Niyaz preparation, and dedicated parking.",
      usageTags: "Majlis,Nikah / Walima,Niyaz,Community Program",
      pricing: "Rs 15,000 / event",
      pricingDetails: JSON.stringify({
        "Jamaat Members": { "Standard": "Rs 15,000", "AC Charges": "Rs 5,000 extra" },
        "Non-Members": { "Standard": "Rs 30,000", "AC Charges": "Rs 8,000 extra" }
      }),
      functionTimings: "Morning Slot: 10:00 AM - 4:00 PM\nEvening Slot: 6:00 PM - 11:30 PM",
      termsAndConditions: "- Advance booking requires 50% deposit.\n- Decoration must be handled by approved panel decorators.\n- Sound systems must be kept within permissible limits after 10 PM.",
      status: "PUBLISHED",
      managedById: admin.id
    },
    {
      name: "Mehfil-e-Abbas Ground",
      propertyType: "Other Community Property",
      location: "Bandra West, Mumbai",
      city: "Mumbai",
      capacity: 1500,
      shortDescription: "Expansive open-air ground suitable for massive community events and sports.",
      description: "An expansive open-air ground suitable for massive community events, sports tournaments, and large-scale Niyaz distribution. The ground is well-leveled and includes basic lighting, washroom facilities, and a small administrative office.",
      usageTags: "Community Program,Sports,Large Gatherings",
      pricing: "Rs 25,000 / day",
      status: "PUBLISHED",
      managedById: admin.id
    },
    {
      name: "Fatima Zehra (s.a) Ladies Hall",
      propertyType: "Hall / Venue",
      location: "Andheri East, Mumbai",
      city: "Mumbai",
      capacity: 250,
      shortDescription: "A secure, elegantly designed hall dedicated exclusively for ladies' events.",
      description: "A secure, elegantly designed hall dedicated exclusively for ladies' events. Ideal for Milad, private family gatherings, and ladies' Majalis. Features a built-in sound system, comfortable seating, and a private dining area.",
      usageTags: "Majlis,Ladies Event,Milad",
      pricing: "Rs 8,000 / event",
      status: "PUBLISHED",
      managedById: admin.id
    }
  ];

  for (const cp of communityProperties) {
    await prisma.communityProperty.create({ data: cp });
  }

  // 2. Seed Member Marketplace Listings (Real-looking data)
  const marketplaceListings = [
    {
      title: "Toyota Innova Crysta (2020) - Mint Condition",
      shortDescription: "Mint condition Toyota Innova Crysta (Diesel) with original paint.",
      description: "Selling our family car, a 2020 Toyota Innova Crysta (Diesel). It has been driven carefully by a single owner, fully serviced at authorized Toyota centers. Zero accidents, original paint, and brand new tires installed last month. Perfect vehicle for large families.",
      category: "Vehicles",
      transactionType: "SELL",
      price: 1850000,
      currency: "INR",
      location: "Bandra West, Mumbai",
      status: "PUBLISHED",
      sellerId: admin.id
    },
    {
      title: "2BHK Apartment Available for Rent in Dongri",
      shortDescription: "Spacious 2BHK apartment 5 mins from Imambargah.",
      description: "Spacious and well-ventilated 2BHK apartment available for families. Located just 5 minutes walking distance from the main Imambargah. Features modular kitchen, 24/7 water supply, and one dedicated car parking spot. Building has 2 elevators and security.",
      category: "Real Estate",
      transactionType: "RENT",
      price: 45000,
      currency: "INR",
      location: "Dongri, Mumbai",
      status: "PUBLISHED",
      sellerId: admin.id
    },
    {
      title: "Brand New iPhone 15 Pro (256GB, Titanium)",
      shortDescription: "Unboxed iPhone 15 Pro, 256GB Natural Titanium.",
      description: "Unboxed but never used iPhone 15 Pro, 256GB Natural Titanium. Was gifted to me but I prefer Android. Comes with the original box, cable, and a 1-year Apple warranty starting from this month. Price is slightly negotiable for quick buyers.",
      category: "Electronics",
      transactionType: "SELL",
      price: 125000,
      currency: "INR",
      location: "Andheri, Mumbai",
      status: "PUBLISHED",
      sellerId: admin.id
    },
    {
      title: "Looking for a used PS5",
      shortDescription: "Looking to buy a pre-owned PlayStation 5 (Disc edition).",
      description: "I am looking to buy a pre-owned PlayStation 5 in good condition (Disc edition preferred). Please DM me if you are upgrading and want to sell yours. Ready to pay cash immediately.",
      category: "Electronics",
      transactionType: "WANTED",
      price: 35000,
      currency: "INR",
      location: "Mumbai",
      status: "PUBLISHED",
      sellerId: admin.id
    }
  ];

  for (const ml of marketplaceListings) {
    await prisma.marketplaceListing.create({ data: ml });
  }

  console.log('Successfully seeded professional Community Properties and Member Marketplace records.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
