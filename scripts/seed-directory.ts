import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding fake directory data...");

  // Create 5 fake users to own these listings
  const fakeUsers = [];
  
  // Shujaat (Cybercart Owner)
  const shujaat = await prisma.user.upsert({
    where: { email: `codingwithali72@gmail.com` },
    update: {},
    create: {
      googleId: `117594228546420565527`,
      email: `codingwithali72@gmail.com`,
      name: `Shujaat Ali Punjani`,
    },
  });
  fakeUsers.push(shujaat);

  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `fakeuser${i}@example.com` },
      update: {},
      create: {
        googleId: `fake-google-id-${i}`,
        email: `fakeuser${i}@example.com`,
        name: `Fake User ${i}`,
      },
    });
    fakeUsers.push(user);
  }

  const listingsData = [
    // CYBERCART SOLUTIONS
    {
      ownerId: fakeUsers[0].id,
      listingType: "Service",
      name: "Cybercart solutions",
      shortDescription: "All Types of web solutions",
      description: "We build blazing fast modern applications.",
      category: "Technology & Digital",
      subcategory: "Web developer",
      services: JSON.stringify(["web design","website","digital","marketing","business"]),
      skills: JSON.stringify([]),
      location: "Mumbai",
      serviceMode: "Both",
      status: "PUBLISHED",
      contact: {
        create: { phoneVisibility: "CHAT_ONLY", emailVisibility: "CHAT_ONLY" }
      }
    },
    // Web Developers (overlapping)
    {
      ownerId: fakeUsers[0].id,
      listingType: "Service",
      name: "PixelCraft Digital",
      shortDescription: "Modern web development and SEO",
      description: "We build blazing fast React and Next.js applications for modern businesses.",
      category: "Technology & Digital",
      subcategory: "Web Development",
      services: JSON.stringify(["Web Design", "SEO", "Next.js"]),
      skills: JSON.stringify(["React", "TypeScript", "Tailwind"]),
      location: "Mumbai",
      serviceMode: "Both",
      status: "PUBLISHED",
      contact: {
        create: { phone: "+91 9876543210", email: "hello@pixelcraft.test" }
      }
    },
    {
      ownerId: fakeUsers[1].id,
      listingType: "Professional",
      name: "Ali Web Solutions",
      shortDescription: "Freelance Full-stack Developer",
      description: "10 years of experience building scalable web backends.",
      category: "Technology & Digital",
      subcategory: "Full-stack Developer",
      services: JSON.stringify(["Backend Development", "API Design", "Web Design"]),
      skills: JSON.stringify(["Node.js", "Python", "SQL"]),
      location: "Remote",
      serviceMode: "Online",
      status: "PUBLISHED",
      contact: {
        create: { whatsapp: "+91 8877665544" }
      }
    },
    // Healthcare
    {
      ownerId: fakeUsers[2].id,
      listingType: "Professional",
      name: "Dr. Fatima Ali",
      shortDescription: "General Physician & Consultant",
      description: "Family doctor available for online consultations and in-person clinic visits.",
      category: "Healthcare",
      subcategory: "General Physician",
      services: JSON.stringify(["Consultation", "Prescriptions", "General Checkup"]),
      skills: JSON.stringify(["Internal Medicine"]),
      location: "Bandra Clinic, Mumbai",
      serviceMode: "Both",
      status: "PUBLISHED",
      contact: {
        create: { phone: "+91 7766554433", whatsappVisibility: "PUBLIC" }
      }
    },
    {
      ownerId: fakeUsers[3].id,
      listingType: "Business",
      name: "Crescent Care Pharmacy",
      shortDescription: "24/7 Pharmacy with home delivery",
      description: "All genuine medicines with quick 30-minute delivery in the local area.",
      category: "Healthcare",
      subcategory: "Pharmacy",
      services: JSON.stringify(["Home Delivery", "Baby Care", "Vitamins"]),
      skills: JSON.stringify([]),
      location: "Dongri, Mumbai",
      serviceMode: "In-person",
      status: "PUBLISHED",
      contact: {
        create: { phone: "+91 1122334455" }
      }
    },
    // Services / Trades
    {
      ownerId: fakeUsers[4].id,
      listingType: "Service",
      name: "CoolAir AC Repairs",
      shortDescription: "Fast & reliable AC maintenance",
      description: "Servicing all major brands of Air Conditioners. Window and Split AC installation and repair.",
      category: "Home Services",
      subcategory: "AC Repair",
      services: JSON.stringify(["AC Installation", "Gas Filling", "AC Servicing"]),
      skills: JSON.stringify([]),
      location: "South Mumbai",
      serviceMode: "In-person",
      status: "PUBLISHED",
      contact: {
        create: { phone: "+91 9998887776", whatsapp: "+91 9998887776" }
      }
    },
    {
      ownerId: fakeUsers[0].id, // fakeUser 0 has two listings
      listingType: "Service",
      name: "QuickFix Plumbers",
      shortDescription: "Emergency plumbing services 24/7",
      description: "Leakages, pipe bursts, bathroom fittings, and complete pipe renewals.",
      category: "Home Services",
      subcategory: "Plumbing",
      services: JSON.stringify(["Leak Repair", "Bathroom Fittings", "Pipe Fixing"]),
      skills: JSON.stringify([]),
      location: "Mumbai South",
      serviceMode: "In-person",
      status: "PUBLISHED",
      contact: {
        create: { phone: "+91 8887776665" }
      }
    },
    // Food & Dining
    {
      ownerId: fakeUsers[1].id,
      listingType: "Business",
      name: "Bismillah Caterers",
      shortDescription: "Premium catering for majlis & weddings",
      description: "Specializing in Bohri and Mughlai cuisine. Bulk orders taken for Niyaz and weddings.",
      category: "Food & Dining",
      subcategory: "Catering",
      services: JSON.stringify(["Wedding Catering", "Majlis Niyaz", "Live Counters"]),
      skills: JSON.stringify([]),
      location: "Mumbai",
      serviceMode: "In-person",
      status: "PUBLISHED",
      contact: {
        create: { whatsapp: "+91 7776665554" }
      }
    },
    {
      ownerId: fakeUsers[2].id,
      listingType: "Business",
      name: "Zoya's Bakehouse",
      shortDescription: "Custom cakes and desserts",
      description: "Eggless cakes, brownies, and customized fondant cakes for all occasions.",
      category: "Food & Dining",
      subcategory: "Bakery",
      services: JSON.stringify(["Custom Cakes", "Brownies", "Dessert Tables"]),
      skills: JSON.stringify(["Baking", "Fondant Art"]),
      location: "Andheri, Mumbai",
      serviceMode: "Online",
      status: "PUBLISHED",
      contact: {
        create: { email: "order@zoyabakehouse.test" }
      }
    },
    // Education / Professional
    {
      ownerId: fakeUsers[3].id,
      listingType: "Professional",
      name: "Hassan Math Tutor",
      shortDescription: "Expert ICSE/CBSE Mathematics Tutor",
      description: "Online and home tuitions for 8th to 12th standard mathematics.",
      category: "Education",
      subcategory: "Tutor",
      services: JSON.stringify(["Home Tuition", "Online Classes", "Crash Courses"]),
      skills: JSON.stringify(["Mathematics", "Calculus"]),
      location: "Remote / Mumbai",
      serviceMode: "Both",
      status: "PUBLISHED",
      contact: {
        create: { phone: "+91 6665554443" }
      }
    },
    {
      ownerId: fakeUsers[4].id,
      listingType: "Professional",
      name: "Zahra Legal Consultancy",
      shortDescription: "Corporate Law and Contracts",
      description: "Legal drafting, company registration, and property dispute resolution.",
      category: "Professional Services",
      subcategory: "Lawyer",
      services: JSON.stringify(["Legal Drafting", "Contracts", "Consultation"]),
      skills: JSON.stringify(["Corporate Law", "Property Law"]),
      location: "Fort, Mumbai",
      serviceMode: "Both",
      status: "PUBLISHED",
      contact: {
        create: { email: "zahra@legalconsulting.test" }
      }
    }
  ];

  for (const data of listingsData) {
    // Check if listing with same name exists to avoid duplicates on re-run
    const exists = await prisma.directoryListing.findFirst({ where: { name: data.name } });
    if (!exists) {
      await prisma.directoryListing.create({ data });
    }
  }

  console.log("Database seeded successfully with 10 listings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
