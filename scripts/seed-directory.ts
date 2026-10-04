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

  // Clear previously seeded items to allow fresh injection with rich descriptions
  await prisma.directoryListing.deleteMany({
    where: {
      ownerId: admin.id
    }
  });

  const businesses = [
    {
      name: 'H. Karmali & Co.',
      listingType: 'BUSINESS',
      category: 'Events & Decor',
      subcategory: 'Construction & Real Estate',
      shortDescription: 'Premium Mandap Decorators & Furniture Hire',
      description: 'H. Karmali & Co. is a leading provider of premium event decoration, mandap setups, and furniture on hire in Mumbai. With decades of experience, we specialize in transforming venues into extraordinary spaces for weddings, corporate events, and religious gatherings. We also serve as trusted Government and Municipal contractors, ensuring high-quality, compliant execution of civil and structural projects.',
      services: JSON.stringify(['Mandap Decorators', 'Government / Municipal Contractors', 'Furniture on Hire', 'Event Styling', 'Civil Contractor']),
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
      shortDescription: 'Non-Profit Healthcare & Pathology Services',
      description: 'Rexello Health Care is a non-profit making venture with services directed towards the underprivileged sections of society. Managed by the Rexello Charitable Trust, we offer highly subsidized pathology testing, basic diagnostic services, and medical consultations. Our mission is to ensure that quality healthcare remains accessible to everyone, regardless of their financial background.',
      services: JSON.stringify(['Pathology Testing', 'Blood Tests', 'Basic Diagnostics', 'Charitable Healthcare']),
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
      shortDescription: 'ISO 9001:2008 Certified Real Estate Developers',
      description: 'Sapphire Constructions is a premier real estate development firm committed to building high-quality residential and commercial spaces. As an ISO 9001:2008 certified company, we adhere to stringent quality control measures, timely delivery, and transparent business practices. Our portfolio includes modern apartments, office complexes, and luxury villas across Mumbai.',
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
      shortDescription: 'Expert Property Consultants & Investment Planning',
      description: 'United Estates provides comprehensive property consulting and investment planning services. We help clients navigate the complex real estate market in Mumbai and Navi Mumbai, offering personalized advice on buying, selling, and leasing properties. Whether you are looking for a dream home or a high-yield commercial investment, our experienced advisors are here to guide you.',
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
      shortDescription: 'Expert Mandap Decorators & Govt. PWD Contractors',
      description: 'Maharashtra Decor brings your celebrations to life with stunning mandap decorations, elegant drapery, and high-quality furniture supply. We handle weddings, receptions, and large-scale public events. Additionally, as recognized Govt. PWD Contractors, we execute public works with precision and reliability.',
      services: JSON.stringify(['Mandap Decorators', 'Furniture Suppliers', 'Govt. PWD Contractors', 'Stage Setup']),
      addressLine1: '106, J. B. Shah Marg, (Chinch Bunder Road)',
      addressLine2: 'Opp. Dawoodbhoy Fazal High School',
      city: 'Mumbai',
      pincode: '400 009',
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
      shortDescription: 'Islamic Media, Publishing & Education (Channel WIN)',
      description: 'World Islamic Network (Channel WIN) is a registered public trust dedicated to Islamic education, media broadcasting, and literature. We operate Channel WIN, the Khatijatul Kubra Book Library, and WIN Academy for students. We also publish a wide range of Islamic books, CDs, and DVDs, and conduct specialized Islamic classes for ladies.',
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
      shortDescription: 'Hotel Blue Diamond - Comfort & Hospitality',
      description: 'Hotel Blue Diamond offers comfortable, well-appointed accommodations for travelers and families. Located centrally in Manhuva, we provide excellent room service, dining options, and modern amenities to ensure a pleasant stay for all our guests.',
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
      shortDescription: 'Global Exporters & Manufacturers',
      description: 'Virani Enterprises is a dynamic manufacturing and export house based in Mumbai. We specialize in producing high-quality industrial goods and exporting them globally. With a state-of-the-art facility in Andheri East, we ensure strict quality compliance and timely international shipments.',
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
      shortDescription: 'Ziyarat, Hajj & Umrah Tour Operators',
      description: 'Khyber Tours is a highly trusted travel agency specializing in religious tourism. We organize comprehensive Hajj, Umrah, and Ziyarat packages with premium accommodations, guided tours, and seamless visa processing. Let us take care of the logistics while you focus on your spiritual journey.',
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
      description: 'C.G. International Commodities is a prominent trading house dealing in a wide variety of bulk commodities. Based in Ahmedabad, we import and export agricultural products, textiles, and raw materials, connecting domestic manufacturers with international markets.',
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
      shortDescription: 'Protective Coatings & Corrosion Control Systems',
      description: 'Mujtaba Marine Pvt. Ltd. is an authorized dealer of A-Tec protective coatings. We provide advanced corrosion control systems and industrial marine coatings designed to withstand harsh environments. With branches in Mumbai, Bhavnagar, and Jamnagar, we serve the shipping and heavy manufacturing sectors.',
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
      shortDescription: 'International Shipping & Freight Forwarding',
      description: 'Time Shipping Limited provides comprehensive logistics, freight forwarding, and international shipping solutions. We handle complex supply chains, customs clearance, and secure cargo transport across air and sea routes, ensuring your goods reach their destination on time.',
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
      shortDescription: 'Wholesaler & Retailer of Manto, Arabic Coats & Scarves',
      description: 'Burqa Collection is a leading retailer and wholesaler of modest Islamic wear. We offer a beautiful selection of mantos, Arabic coats, hijabs, scarves, and religious items including stone rings. We supply to both individual retail customers and wholesale boutiques.',
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
      listingType: 'PROFESSIONAL',
      category: 'Professional Services',
      shortDescription: 'Independent Professional Consultant',
      description: 'S. M. Panjwani offers independent professional consulting and advisory services based out of Wadala. With a strong track record of providing strategic guidance, we work with clients to navigate complex business and administrative challenges.',
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
    },
    // Adding NEW highly detailed, realistic seeded records across other categories
    {
      name: 'PixelCraft Digital Agency',
      listingType: 'SERVICE',
      category: 'Technology & Digital',
      subcategory: 'Web Design & Development',
      shortDescription: 'Bespoke web development and digital marketing for modern brands.',
      description: 'PixelCraft is a full-service digital agency focused on building lightning-fast web applications, stunning marketing websites, and robust e-commerce platforms. We utilize Next.js, React, and Supabase to deliver enterprise-grade performance. Beyond development, our team handles SEO, UI/UX design, and brand identity to ensure your digital presence stands out.',
      services: JSON.stringify(['Web Development', 'UI/UX Design', 'SEO Optimization', 'E-commerce Solutions', 'Brand Identity']),
      keywords: JSON.stringify(['website', 'developer', 'software', 'marketing', 'agency']),
      tags: JSON.stringify(['Next.js', 'React', 'Digital']),
      addressLine1: 'Unit 402, Tech Hub',
      area: 'Andheri West',
      city: 'Mumbai',
      pincode: '400053',
      location: 'Andheri West, Mumbai',
      serviceArea: 'Global (Remote)',
      serviceMode: 'Online',
      website: 'www.pixelcraft.local',
      contactEmail: 'hello@pixelcraft.local',
      contactPhone: '+91 98765 43210',
      sourceType: 'MANUAL_SEED',
      verificationStatus: 'VERIFIED'
    },
    {
      name: 'Dr. Aliya Merchant',
      listingType: 'PROFESSIONAL',
      category: 'Healthcare',
      subcategory: 'Consultant Pediatrician',
      shortDescription: 'Experienced Pediatrician providing compassionate child healthcare.',
      description: 'Dr. Aliya Merchant is a board-certified Pediatrician with over 15 years of experience in child health, vaccinations, and adolescent medicine. Operating a modern, child-friendly clinic, Dr. Merchant provides comprehensive health checkups, nutritional counseling, and management of chronic pediatric conditions. Online consultations are also available for follow-ups.',
      services: JSON.stringify(['Child Vaccination', 'Newborn Care', 'Adolescent Medicine', 'Nutritional Counseling', 'Fever Management']),
      addressLine1: 'Care Clinic, Shop 2',
      area: 'Bandra West',
      city: 'Mumbai',
      pincode: '400050',
      location: 'Bandra West, Mumbai',
      serviceMode: 'Both',
      contactEmail: 'clinic@draliyamerchant.local',
      contactPhone: '022-2645-9988',
      sourceType: 'MANUAL_SEED',
      verificationStatus: 'VERIFIED'
    },
    {
      name: 'Zaiqa Catering Services',
      listingType: 'BUSINESS',
      category: 'Hospitality & Food',
      subcategory: 'Event Catering',
      shortDescription: 'Authentic Mughlai & Continental catering for large events.',
      description: 'Zaiqa Catering Services specializes in delivering authentic, mouth-watering Mughlai, Indian, and Continental cuisines for weddings, corporate gatherings, and community events. With a capacity to serve up to 5000 guests, our professional culinary team ensures impeccable hygiene, beautiful presentation, and an unforgettable taste experience.',
      services: JSON.stringify(['Wedding Catering', 'Corporate Events', 'Live Counters', 'Buffet Setup', 'Custom Menus']),
      area: 'Byculla',
      city: 'Mumbai',
      pincode: '400008',
      location: 'Byculla, Mumbai',
      serviceArea: 'Mumbai, Navi Mumbai, Thane',
      contactPhone: '+91 99887 76655',
      sourceType: 'MANUAL_SEED',
      verificationStatus: 'VERIFIED'
    },
    {
      name: 'M. Ali & Associates',
      listingType: 'PROFESSIONAL',
      category: 'Professional Services',
      subcategory: 'Legal & Tax Consulting',
      shortDescription: 'Corporate Law, Taxation, and Dispute Resolution.',
      description: 'M. Ali & Associates is a boutique law firm providing expert legal counsel in corporate law, direct/indirect taxation, and civil dispute resolution. We assist startups with company registration and compliance, and help established businesses navigate complex tax audits and intellectual property filings.',
      services: JSON.stringify(['Tax Filing', 'Company Registration', 'Civil Litigation', 'IP Trademark', 'Contract Drafting']),
      addressLine1: 'Office 15, Fortuna Tower',
      area: 'Fort',
      city: 'Mumbai',
      location: 'Fort, Mumbai',
      website: 'www.maliassociates.local',
      contactEmail: 'legal@maliassociates.local',
      contactPhone: '+91 90001 10009',
      sourceType: 'MANUAL_SEED',
      verificationStatus: 'VERIFIED'
    },
    {
      name: 'Elite Home Maintainence',
      listingType: 'SERVICE',
      category: 'Other',
      subcategory: 'Home Services',
      shortDescription: 'Reliable Plumbing, Electrical, and AC Repair services.',
      description: 'Elite Home Maintenance provides fast, reliable, and background-checked technicians for all your household repair needs. From fixing leaky plumbing and rewiring electrical panels, to deep-cleaning and servicing split Air Conditioners, we are a one-stop solution for maintaining your property. We offer annual maintenance contracts (AMC) for residential societies.',
      services: JSON.stringify(['AC Repair & Servicing', 'Plumbing', 'Electrical Repairs', 'Deep Cleaning', 'AMC Services']),
      keywords: JSON.stringify(['AC', 'plumber', 'electrician', 'cleaning', 'repair']),
      serviceArea: 'South Mumbai to Andheri',
      location: 'Mumbai',
      contactPhone: '+91 91234 56789',
      sourceType: 'MANUAL_SEED',
      verificationStatus: 'UNVERIFIED'
    }
  ];

  for (const b of businesses) {
    const { contactPhone, contactEmail, ...listingData } = b;

    console.log(`Creating/Replacing business ${b.name}...`);
    await prisma.directoryListing.create({
      data: {
        ...listingData,
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
