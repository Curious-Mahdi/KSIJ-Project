import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Community Properties...');

  // 1. Get an admin user (we will use this user as the managedBy for the properties)
  let admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!admin) {
    console.log('No admin user found. Falling back to any user...');
    admin = await prisma.user.findFirst();
  }
  
  if (!admin) {
    console.log('No user found at all. Creating a dummy admin user...');
    admin = await prisma.user.create({
      data: {
        googleId: 'dummy-admin-google-id',
        name: 'System Admin',
        email: 'admin@ksijreload.local',
        isAdmin: true
      }
    });
  }

  // Create a separate test user to own member listings so the current user can chat with them
  let testSeller = await prisma.user.findFirst({
    where: { email: 'test.seller@ksijreload.local' }
  });

  if (!testSeller) {
    console.log('Creating Test Seller user...');
    testSeller = await prisma.user.create({
      data: {
        googleId: 'test-seller-google-id',
        name: 'Community Member (Test Seller)',
        email: 'test.seller@ksijreload.local',
        isAdmin: false
      }
    });
  }

  const properties = [
    {
      name: 'KSIJ Masjid Dongri — Masjid & Imambara Hall',
      propertyType: 'Hall / Venue',
      shortDescription: 'KSIJ Masjid and Imambara Hall in Dongri is a community-managed venue used for Majlis, Niyaz, Nikah, Walima, marriages and other functions.',
      description: 'KSIJ Masjid and Imambara Hall in Dongri is a community-managed venue used for Majlis, Niyaz, Nikah, Walima, marriages and other functions. Charges and arrangements vary depending on the type of gathering and requirements.',
      managedById: admin.id,
      address: '66/70 Hazrat Abbas a.s Street',
      area: 'Dongri',
      city: 'Mumbai',
      location: 'Dongri, Mumbai 400009',
      usageTags: 'Nikah / Walima, Majlis, Niyaz, Community Program, Religious Gathering',
      pricing: 'Pricing as per official Trust resolution',
      pricingDetails: JSON.stringify({
        masjid: {
          gentsMajlis: '₹500',
          majlisRecording: '₹1,000',
          masjidAC: '₹2,500 per hour',
          fullLight: '₹1,000',
        },
        imambaraHallReligious: {
          ladiesMajlis: '₹1,000 per hall',
          gentsLadiesMajlisNiyaz: '₹3,000 per hall',
          infalliblesNiyaz: '₹1,500 per hall',
        },
        imambaraHallMarriage: {
          gents: '₹15,000 per hall',
          ladies: '₹15,000 per hall',
        },
        other: {
          extra: '₹1,000 per hour',
          housekeeping: '₹1,000 per hall',
          ac: '₹2,500 per hour',
          videoShoot: '₹1,000',
          kitchenUse: '₹1,500',
        }
      }),
      functionTimings: '11:00 AM – 3:00 PM\n6:00 PM – 11:00 PM',
      termsAndConditions: 'Marriage-purpose deposit: ₹10,000 for 1 hall/floor.\nAdditional deposit: ₹5,000 if more than 1 hall/floor is booked.\nMusic is not allowed.\nDamage to Trust property must be reimbursed.\nAdditional terms may apply. Please confirm with the Trust.',
    },
    {
      name: 'Aarambaug Hall',
      propertyType: 'Hall / Venue',
      shortDescription: 'Community-managed hall serving local community gatherings and functions.',
      description: 'Community-managed hall serving local community gatherings and functions.',
      managedById: admin.id,
      area: 'Aarambaug / Mazgaon',
      city: 'Mumbai',
      location: 'Aarambaug / Mazgaon, Mumbai',
      usageTags: 'Community Function, Religious Gathering, Other Functions',
      pricing: 'Details to be confirmed',
    },
    {
      name: 'Kapaswadi Mehfil-e-Mustafa',
      propertyType: 'Hall / Venue',
      shortDescription: 'Community venue serving local religious and community gatherings.',
      description: 'Community venue serving local religious and community gatherings.',
      managedById: admin.id,
      area: 'Kapaswadi',
      city: 'Mumbai',
      location: 'Kapaswadi, Mumbai',
      usageTags: 'Religious Gathering, Majlis, Community Function',
      pricing: 'Details to be confirmed',
    },
    {
      name: 'Nazar Ali Imambada Hall',
      propertyType: 'Hall / Venue',
      shortDescription: 'Community-managed Imambada venue for religious and community gatherings.',
      description: 'Community-managed Imambada venue for religious and community gatherings.',
      managedById: admin.id,
      city: 'Mumbai',
      location: 'Mumbai',
      usageTags: 'Religious Gathering, Majlis, Community Function, Other Functions',
      pricing: 'Details to be confirmed',
    }
  ];

  for (const prop of properties) {
    const existing = await prisma.communityProperty.findFirst({
      where: { name: prop.name }
    });

    if (existing) {
      console.log(`Property ${prop.name} already exists, updating...`);
      await prisma.communityProperty.update({
        where: { id: existing.id },
        data: prop
      });
    } else {
      console.log(`Creating property ${prop.name}...`);
      await prisma.communityProperty.create({
        data: prop
      });
    }
  }
  
  // Seed demo listings for Member Marketplace
  console.log('Seeding Demo Member Listings...');
  
  const demoListings = [
    {
      title: '2 BHK Flat for Rent in Dongri',
      category: 'Property',
      transactionType: 'Rent',
      price: 35000,
      currency: 'INR',
      location: 'Dongri, Mumbai',
      city: 'Mumbai',
      area: 'Dongri',
      bedrooms: 2,
      bathrooms: 2,
      condition: 'Good',
      shortDescription: '2 BHK flat available for rent in Dongri.',
      description: '2 BHK flat available for rent in Dongri.',
      propertyType: 'Residential',
    },
    {
      title: '2 BHK Home for Sale in Dongri',
      category: 'Property',
      transactionType: 'Sale',
      price: 15000000,
      currency: 'INR',
      location: 'Dongri, Mumbai',
      city: 'Mumbai',
      area: 'Dongri',
      bedrooms: 2,
      bathrooms: 2,
      shortDescription: '2 BHK residential property available for sale in Dongri.',
      description: '2 BHK residential property available for sale in Dongri.',
      propertyType: 'Residential',
    },
    {
      title: 'Honda Activa — Good Condition',
      category: 'Vehicles',
      transactionType: 'Sale',
      price: 55000,
      currency: 'INR',
      location: 'Mumbai',
      city: 'Mumbai',
      condition: 'Used - Good',
      shortDescription: 'Honda Activa in good condition.',
      description: 'Honda Activa in good condition.',
      vehicleType: 'Scooter',
      brand: 'Honda',
      model: 'Activa',
    },
    {
      title: 'Royal Enfield Classic 350',
      category: 'Vehicles',
      transactionType: 'Sale',
      price: 135000,
      currency: 'INR',
      location: 'Mumbai',
      city: 'Mumbai',
      condition: 'Used - Good',
      shortDescription: 'Royal Enfield Classic 350 in good condition.',
      description: 'Royal Enfield Classic 350 in good condition.',
      vehicleType: 'Motorcycle',
      brand: 'Royal Enfield',
      model: 'Classic 350',
    },
    {
      title: 'iPhone 15 128GB',
      category: 'Electronics',
      transactionType: 'Sale',
      price: 45000,
      currency: 'INR',
      location: 'Mumbai',
      city: 'Mumbai',
      condition: 'Used - Good',
      shortDescription: 'iPhone 15 128GB in good condition.',
      description: 'iPhone 15 128GB in good condition.',
      brand: 'Apple',
      model: 'iPhone 15',
    },
    {
      title: 'MacBook Air',
      category: 'Electronics',
      transactionType: 'Sale',
      price: 70000,
      currency: 'INR',
      location: 'Mumbai',
      city: 'Mumbai',
      condition: 'Used - Good',
      shortDescription: 'MacBook Air in good condition.',
      description: 'MacBook Air in good condition.',
      brand: 'Apple',
      model: 'MacBook Air',
    },
    {
      title: '3-Seater Sofa Set',
      category: 'Furniture',
      transactionType: 'Sale',
      price: 18000,
      currency: 'INR',
      location: 'Mumbai',
      city: 'Mumbai',
      condition: 'Used - Good',
      shortDescription: '3-Seater Sofa Set in good condition.',
      description: '3-Seater Sofa Set in good condition.',
    },
    {
      title: 'Shop Space Available for Rent',
      category: 'Property',
      transactionType: 'Rent',
      price: 50000,
      currency: 'INR',
      location: 'Mumbai',
      city: 'Mumbai',
      shortDescription: 'Commercial shop space available for rent.',
      description: 'Commercial shop space available for rent.',
      propertyType: 'Commercial',
    }
  ];

  for (const listing of demoListings) {
    const existing = await prisma.marketplaceListing.findFirst({
      where: { title: listing.title }
    });

    if (existing) {
      console.log(`Demo listing ${listing.title} already exists, updating...`);
      await prisma.marketplaceListing.update({
        where: { id: existing.id },
        data: {
          ...listing,
          sellerId: testSeller.id,
        }
      });
    } else {
      console.log(`Creating demo listing ${listing.title}...`);
      await prisma.marketplaceListing.create({
        data: {
          ...listing,
          sellerId: testSeller.id,
        }
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
