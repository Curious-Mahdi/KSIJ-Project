import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Real Directory Businesses from Source Scans...');

  // Get admin user (or a system user) to own these records
  let admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!admin) {
    console.log('No admin user found. Creating a generic Directory Admin user...');
    admin = await prisma.user.create({
      data: {
        googleId: 'directory-admin-google-id',
        name: 'Directory Admin',
        email: 'directory.admin@ksijreload.local',
        isAdmin: true
      }
    });
  }

  const businesses = [
    {
      name: 'H. Karmali & Co.',
      listingType: 'BUSINESS',
      category: 'Events & Decor',
      subcategory: 'Construction & Real Estate',
      shortDescription: 'Mandap Decorators, Furniture on Hire, Contractors',
      services: JSON.stringify(['Mandap Decorators', 'Government / Municipal Contractors', 'Furniture on Hire', 'Developer']),
      addressLine1: 'Shariff Mansion, 115, S.V.P. Road',
      addressLine2: 'Near Hazrat Imam Husein (a.s) Chowk',
      area: 'Dongri',
      city: 'Mumbai',
      pincode: '400 009',
      location: 'Dongri, Mumbai',
      website: 'www.hkarmali.com',
      contactEmail: 'safdar.karmali@rediffmail.com',
      contactPhone: '2377 6068, 2377 8688, 2371 4019, 98210 13184',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '10',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Rexello Health Care',
      listingType: 'BUSINESS',
      category: 'Healthcare',
      shortDescription: 'Non Profit Making Venture with Service Directed Towards The Underprivileged Section of Society',
      services: JSON.stringify(['Pathology Facility Available']),
      addressLine1: '48, Nishanpada Road',
      addressLine2: 'Opp. Karnataka Haj House',
      area: 'Dongri',
      city: 'Mumbai',
      pincode: '400 009',
      location: 'Dongri, Mumbai',
      contactPhone: '2377 6474, 2377 6475',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '12',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Sapphire Constructions',
      listingType: 'BUSINESS',
      category: 'Construction & Real Estate',
      shortDescription: 'An ISO 9001:2008 Company',
      addressLine1: 'Crescent Plaza, 10th Floor',
      addressLine2: 'Teligali',
      area: 'Andheri (E)',
      city: 'Mumbai',
      pincode: '400 069',
      location: 'Andheri (E), Mumbai',
      website: 'www.sapphireconstructions.com',
      contactEmail: 'info@sapphireconstructions.com',
      contactPhone: '+91 22 3190 8383, +91 22 2683 4646',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '14',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'United Estates',
      listingType: 'BUSINESS',
      category: 'Construction & Real Estate',
      shortDescription: 'Properties Consultant & Investment Plans',
      serviceArea: 'Mumbai, Navi Mumbai',
      addressLine1: '3, Satyam Niwas, Sector No.20',
      area: 'Nerul (W)',
      city: 'Navi Mumbai',
      location: 'Nerul (W), Navi Mumbai',
      contactPhone: '9833 679 925, 9892 827 147, 9619 682 221',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '15',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Maharashtra Decor',
      listingType: 'BUSINESS',
      category: 'Events & Decor',
      shortDescription: 'Mandap Decorators, Furniture Suppliers, Govt. PWD Contractors',
      services: JSON.stringify(['Mandap Decorators', 'Furniture Suppliers', 'Govt. PWD Contractors']),
      addressLine1: '106, J. B. Shah Marg, (Chinch Bunder Road)',
      addressLine2: 'Opp. Dawoodbhoy Fazal High School',
      city: 'Mumbai',
      pincode: '400 009', // inferred from Mumbai - 9
      location: 'Chinch Bunder Road, Mumbai',
      contactEmail: 'mah.decor@gmail.com',
      contactPhone: '2343 9676, 2343 9682',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '17',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'World Islamic Network',
      listingType: 'BUSINESS',
      category: 'Media & Publishing',
      shortDescription: 'Channel WIN - Regd. Public Trust No. E, 1471 Bom',
      services: JSON.stringify(['Channel WIN', 'Khatijatul Kubra Book Library', 'WIN Academy', 'Publishing Islamic Books', 'Islamic Classes for Ladies', 'CD & DVD Library']),
      addressLine1: '67/69, Hazrat Abbas (a.s) Street',
      area: 'Dongri',
      city: 'Mumbai',
      pincode: '400 009',
      country: 'India',
      location: 'Dongri, Mumbai',
      website: 'www.channelwin.tv, www.winbookshop.com',
      contactEmail: 'winislam@gmail.com',
      contactPhone: '+91-22-2343 3640, 2343 4304',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '25',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Blue Diamond',
      listingType: 'BUSINESS',
      category: 'Hospitality & Food',
      shortDescription: 'Hotel Blue Diamond',
      addressLine1: 'Bagicha Chowk, B/h. Manhuva Police Station',
      city: 'Manhuva',
      pincode: '364 290',
      location: 'Manhuva',
      contactEmail: 'hotelbluediamond@yahoo.com',
      contactPhone: '(02844) 222284, 222285, 222286, 364290',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '35',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Virani Enterprises',
      listingType: 'BUSINESS',
      category: 'Import & Export',
      shortDescription: 'Exporters & Manufacturers',
      addressLine1: 'D-1, Jaffrabhai Industrial Estate, Opp. PMC',
      addressLine2: 'Behind Starplus, Makwana Road',
      area: 'Marol Naka, Andheri (East)',
      city: 'Mumbai',
      pincode: '400 059',
      location: 'Andheri (East), Mumbai',
      contactEmail: 'viranimpex@hotmail.com, viranimpex@yahoo.com',
      contactPhone: '022-2920 2966',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '35',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Khyber Tours',
      listingType: 'BUSINESS',
      category: 'Travel & Transport',
      addressLine1: '38, Hazrat Abbas (a.s) Street, Palagali',
      area: 'Dongri',
      city: 'Mumbai',
      pincode: '400 009',
      location: 'Dongri, Mumbai',
      website: 'www.khybertours.com',
      contactEmail: 'info@khybertours.com',
      contactPhone: '+91-22-2347 9388, 9819908255, 9322037532, 9892714110',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '36',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'C.G. International Commodities',
      listingType: 'BUSINESS',
      category: 'Import & Export',
      shortDescription: 'Importers, Exporters & General Merchants',
      addressLine1: 'A/702, Wall Street II',
      addressLine2: 'Orient Club, Ellis Bridge',
      city: 'Ahmedabad',
      pincode: '380 006',
      country: 'India',
      location: 'Ellis Bridge, Ahmedabad',
      contactPhone: '98205 04286, 98250 15406',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '36',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Mujtaba Marine Pvt. Ltd.',
      listingType: 'BUSINESS',
      category: 'Manufacturing & Industrial',
      shortDescription: 'Authorised Dealer of Protective Coatings and Corrosion Control System',
      addressLine1: '7, Prakash Kunj',
      area: 'Chembur',
      city: 'Mumbai',
      location: 'Chembur, Mumbai',
      contactPhone: '09825 08214, 09769 38214',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '37',
      sourceNotes: 'Scan partially unclear. Head office in Bhavnagar, Branch in Jamnagar.',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Time Shipping Limited',
      listingType: 'BUSINESS',
      category: 'Travel & Transport',
      subcategory: 'Shipping / Logistics',
      addressLine1: '158, 1st Floor, Hill View Building',
      addressLine2: 'Next to Bandra Police Station, Hill Road',
      area: 'Bandra (West)',
      city: 'Mumbai',
      pincode: '400 050',
      location: 'Bandra (West), Mumbai',
      contactPhone: '022-26404326, 09769889994',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '37',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'Burqa Collection',
      listingType: 'BUSINESS',
      category: 'Retail & Shopping',
      shortDescription: 'Wholesaler & Retailer of Manto, Arabic Coat, Scarf, Religious Items',
      addressLine1: '13, Pilkhus Building, Shop No. 6',
      addressLine2: 'Hazrat Abbas (a.s) Street, Palagali',
      area: 'Dongri',
      city: 'Mumbai',
      pincode: '400 009',
      location: 'Dongri, Mumbai',
      contactEmail: 'raza_burqa@yahoo.co.in',
      contactPhone: '23459563, 9820504286, 9323715617',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '38',
      verificationStatus: 'UNVERIFIED'
    },
    {
      name: 'S. M. Panjwani',
      listingType: 'BUSINESS',
      category: 'Professional Services',
      addressLine1: 'Cosmic Heights, B-Wing, #1504, 15th Floor',
      addressLine2: 'Bharati Park',
      area: 'Wadala (East)',
      city: 'Mumbai',
      country: 'India',
      location: 'Wadala (East), Mumbai',
      contactEmail: 'shabspanjwani@hotmail.com',
      contactPhone: '+91-9820210396',
      sourceType: 'COMMUNITY_DIRECTORY_SCAN',
      sourcePage: '38',
      sourceNotes: 'Exact profession unclear from source. Categorized as Professional Services.',
      verificationStatus: 'UNVERIFIED'
    }
  ];

  for (const b of businesses) {
    // Deduplication check
    const existing = await prisma.directoryListing.findFirst({
      where: {
        name: b.name
      }
    });

    if (existing) {
      console.log(`Business ${b.name} already exists. Skipping or you can update it...`);
      continue;
    }

    const { contactPhone, contactEmail, ...listingData } = b;

    console.log(`Creating business ${b.name}...`);
    await prisma.directoryListing.create({
      data: {
        ...listingData,
        shortDescription: listingData.shortDescription || '',
        ownerId: admin.id,
        services: listingData.services || '[]',
        contact: {
          create: {
            phone: contactPhone || null,
            email: contactEmail || null,
            phoneVisibility: 'CHAT_ONLY',
            emailVisibility: 'CHAT_ONLY',
          }
        }
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
