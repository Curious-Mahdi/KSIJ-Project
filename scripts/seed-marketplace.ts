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
      name: "KSIJ Dongri (Main Imambada)",
      propertyType: "Hall / Venue",
      location: "Dongri, Mumbai",
      city: "Mumbai",
      capacity: 1000,
      shortDescription: "The central headquarters and main Imambada for the KSIJ community.",
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
      name: "Haji Nazar Ali Imambada",
      propertyType: "Hall / Venue",
      location: "Mumbai",
      city: "Mumbai",
      capacity: 500,
      shortDescription: "Historic Imambada suitable for Majlis and religious gatherings.",
      description: "A well-maintained and highly respected historic Imambada. Perfect for hosting daily Majalis, Jashn, and other religious programs. The venue offers a serene spiritual environment with excellent acoustics and seating arrangements.",
      usageTags: "Majlis,Jashn,Religious Gathering",
      pricing: "Contact for Pricing",
      status: "PUBLISHED",
      managedById: admin.id
    },
    {
      name: "Arambag (Mazgaon Imambada)",
      propertyType: "Other Community Property",
      location: "Mazgaon, Mumbai",
      city: "Mumbai",
      capacity: 800,
      shortDescription: "Prominent community premises available for structured events and Niyaz.",
      description: "A spacious community ground and structure available for large Niyaz distributions, Majalis, and community welfare programs. The main Mazgaon Imambada serves the local community with dedicated spaces for gents and ladies.",
      usageTags: "Majlis,Niyaz,Community Program",
      pricing: "Rs 10,000 / day",
      status: "PUBLISHED",
      managedById: admin.id
    },
    {
      name: "Mehfil-e-Mustafa (Kapaswadi, Juhu)",
      propertyType: "Hall / Venue",
      location: "Kapaswadi, Juhu, Mumbai",
      city: "Mumbai",
      capacity: 350,
      shortDescription: "Cozy community hall located in Kapaswadi, Juhu.",
      description: "Mehfil-e-Mustafa is a beautiful, intimate community space located in Juhu. It is perfectly suited for smaller family Majalis, Aqiqa ceremonies, and local community meetings. Completely air-conditioned.",
      usageTags: "Majlis,Aqiqa,Family Gathering",
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
      title: "Commercial Shop for Rent in Byculla",
      shortDescription: "Prime commercial space perfect for retail or office.",
      description: "Available immediately: A prime commercial shop on the main road in Byculla. Approx 400 sq.ft carpet area. Ideal for a boutique, small office, or wholesale business. Has attached washroom and 24/7 water supply. No heavy manufacturing allowed.",
      category: "Real Estate",
      transactionType: "RENT",
      price: null,
      currency: "INR",
      location: "Byculla, Mumbai",
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
      title: "Secondhand MacBook Air M1 (2020)",
      shortDescription: "Well maintained MacBook Air M1, 8GB RAM, 256GB SSD.",
      description: "Selling my MacBook Air M1. It's in great condition, mostly used for light web browsing and office work. Battery cycle count is around 150. Comes with the original charger and a sleek laptop sleeve.",
      category: "Electronics",
      transactionType: "SELL",
      price: 60000,
      currency: "INR",
      location: "Andheri, Mumbai",
      status: "PUBLISHED",
      sellerId: admin.id
    },
    {
      title: "Ikea 3-Seater Sofa (Grey)",
      shortDescription: "Barely used 3-seater sofa, moving out sale.",
      description: "Selling a barely used Ikea 3-seater sofa in dark grey. We bought it 6 months ago but are now moving out of the city. No stains, tears, or damage. Buyer must arrange for pickup.",
      category: "Home & Garden",
      transactionType: "SELL",
      price: 12000,
      currency: "INR",
      location: "Mazgaon, Mumbai",
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
