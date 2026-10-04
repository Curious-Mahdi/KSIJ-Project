const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding comprehensive opportunities data for judges...");

  // Get a user to act as the poster
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No users found. Run your initial user seed first.");
    return;
  }

  // Clear existing opportunities
  await prisma.opportunity.deleteMany();
  console.log("Cleared existing opportunities.");

  const opportunities = [
    // ---------------- JOBS ----------------
    {
      type: "JOB",
      title: "Senior Full Stack Engineer",
      organisationName: "Noor Technology Group",
      postedByUserId: user.id,
      description: "We are seeking a highly skilled Senior Full Stack Engineer to lead our new product vertical. You'll be architecting scalable solutions using Next.js, Node.js, and PostgreSQL. Expected to mentor junior developers and drive technical decisions.",
      category: "Technology & Digital",
      skills: "Next.js, Node.js, PostgreSQL, System Design",
      location: "Mumbai",
      workMode: "HYBRID",
      experienceLevel: "5+ years",
      employmentType: "FULL_TIME",
      compensationMin: 120000,
      compensationMax: 180000,
      compensationPeriod: "month",
      verificationStatus: "VERIFIED",
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      type: "JOB",
      title: "Chartered Accountant (Taxation)",
      organisationName: "Al-Ameen Financial Associates",
      postedByUserId: user.id,
      description: "Looking for a qualified CA to manage corporate taxation, GST filings, and financial auditing for our top-tier clients. The ideal candidate has experience in Big 4 or a reputed mid-sized firm.",
      category: "Finance",
      skills: "CA, Taxation, GST, Corporate Finance, Auditing",
      location: "Pune",
      workMode: "ONSITE",
      experienceLevel: "2-5 years",
      employmentType: "FULL_TIME",
      compensationMin: 80000,
      compensationMax: 120000,
      compensationPeriod: "month",
      verificationStatus: "VERIFIED"
    },
    {
      type: "JOB",
      title: "Marketing & PR Manager",
      organisationName: "Crescent Educational Trust",
      postedByUserId: user.id,
      description: "Lead the marketing and public relations efforts for our expanding group of schools. You will manage social media, press releases, and community outreach programs.",
      category: "Education",
      skills: "Marketing, PR, Social Media, Communications",
      location: "Bengaluru",
      workMode: "HYBRID",
      experienceLevel: "5+ years",
      employmentType: "FULL_TIME",
      compensationMin: 60000,
      compensationMax: 90000,
      compensationPeriod: "month"
    },
    {
      type: "JOB",
      title: "Clinical Psychologist",
      organisationName: "Safa Wellness Clinic",
      postedByUserId: user.id,
      description: "Join our mental health facility to provide therapy and counseling to youth and families in the community. Must have an RCI registration.",
      category: "Healthcare",
      skills: "Counseling, Therapy, RCI Registered, Empathy",
      location: "Mumbai",
      workMode: "ONSITE",
      experienceLevel: "2-5 years",
      employmentType: "PART_TIME",
      compensationMin: 40000,
      compensationMax: 60000,
      compensationPeriod: "month",
      verificationStatus: "VERIFIED"
    },

    // ---------------- INTERNSHIPS ----------------
    {
      type: "INTERNSHIP",
      title: "Frontend Developer Intern",
      organisationName: "PixelCraft Digital Agency",
      postedByUserId: user.id,
      description: "Passionate about UI/UX? Join us as a Frontend Developer Intern. You will work on live client projects using React, Next.js, and modern CSS frameworks.",
      category: "Technology & Digital",
      skills: "React, Next.js, HTML, CSS, JavaScript",
      location: "Remote",
      workMode: "REMOTE",
      experienceLevel: "Student",
      employmentType: "INTERNSHIP",
      duration: "3 months",
      compensationMin: 15000,
      compensationMax: 20000,
      compensationPeriod: "month",
      verificationStatus: "VERIFIED"
    },
    {
      type: "INTERNSHIP",
      title: "Graphic Design Intern",
      organisationName: "Khoja Heritage Project",
      postedByUserId: user.id,
      description: "Help us visualize the history of the community. You will design social media posts, brochures, and digital archives. Proficiency in Adobe Creative Suite required.",
      category: "Other",
      skills: "Photoshop, Illustrator, Typography",
      location: "Mumbai",
      workMode: "HYBRID",
      experienceLevel: "Student",
      employmentType: "INTERNSHIP",
      duration: "2 months",
      compensationMin: 10000,
      compensationMax: 120000,
      compensationPeriod: "month"
    },
    {
      type: "INTERNSHIP",
      title: "Data Analytics Intern",
      organisationName: "FinTech Solutions LLC",
      postedByUserId: user.id,
      description: "Learn to process large financial datasets. You'll assist our data scientists in cleaning data, running SQL queries, and building Tableau dashboards.",
      category: "Technology & Digital",
      skills: "SQL, Python, Excel, Tableau",
      location: "Pune",
      workMode: "ONSITE",
      experienceLevel: "Fresher",
      employmentType: "INTERNSHIP",
      duration: "6 months",
      compensationMin: 25000,
      compensationPeriod: "month",
      verificationStatus: "VERIFIED"
    },

    // ---------------- MENTORSHIP ----------------
    {
      type: "MENTORSHIP",
      title: "Career Mentorship — Tech Leadership",
      organisationName: "Community Professionals Network",
      postedByUserId: user.id,
      description: "I am a VP of Engineering at a Fortune 500 company. I'm offering mentorship to 2 mid-level developers who are looking to transition into engineering management.",
      category: "Technology & Digital",
      skills: "Leadership, System Design, Career Growth",
      location: "Remote",
      workMode: "REMOTE",
      experienceLevel: "5+ years",
      mentorCapacity: 2,
      timeCommitment: "1 hour / week",
      verificationStatus: "VERIFIED"
    },
    {
      type: "MENTORSHIP",
      title: "Guidance for Medical Students (NEET/MBBS)",
      organisationName: "KSIJ Medical Advisory",
      postedByUserId: user.id,
      description: "Are you a student preparing for medical entrance exams or currently in your MBBS? I am a Senior Consultant Cardiologist and can provide academic and career guidance.",
      category: "Healthcare",
      skills: "NEET Preparation, Career Counseling, Medical Studies",
      location: "Mumbai",
      workMode: "HYBRID",
      experienceLevel: "Student",
      mentorCapacity: 5,
      timeCommitment: "2 hours / month"
    },
    {
      type: "MENTORSHIP",
      title: "Startup & Entrepreneurship Mentoring",
      organisationName: "Entrepreneurs Guild",
      postedByUserId: user.id,
      description: "Successfully raised Series A for my SaaS startup. Happy to mentor young founders in the community on pitch decks, fundraising, and product-market fit.",
      category: "Finance",
      skills: "Fundraising, Pitching, Product Strategy, SaaS",
      location: "Remote",
      workMode: "REMOTE",
      experienceLevel: "0-2 years",
      mentorCapacity: 3,
      timeCommitment: "Flexible",
      verificationStatus: "VERIFIED"
    },

    // ---------------- PROJECTS ----------------
    {
      type: "PROJECT",
      title: "Community Library Digitalisation Portal",
      organisationName: "KSIJ Education Board",
      postedByUserId: user.id,
      description: "We are building an open-source web portal to catalog our massive community library in Dongri. Looking for volunteer developers, UI designers, and data entry personnel.",
      category: "Technology & Digital",
      skills: "React, Node.js, UX Design, Data Entry",
      location: "Mumbai",
      workMode: "HYBRID",
      duration: "3 months",
      timeCommitment: "5 hours / week",
      verificationStatus: "VERIFIED"
    },
    {
      type: "PROJECT",
      title: "Heritage Mosque Architectural Documentation",
      organisationName: "Jamaat Planning Committee",
      postedByUserId: user.id,
      description: "A short-term project for architecture students/professionals to help document the structural floor plans of our century-old mosques for restoration purposes.",
      category: "Other",
      skills: "AutoCAD, Architectural Survey, Photography",
      location: "Mumbai",
      workMode: "ONSITE",
      duration: "1 month",
      timeCommitment: "Weekends only"
    },
    {
      type: "PROJECT",
      title: "Financial Literacy App Localization",
      organisationName: "Welfare Board",
      postedByUserId: user.id,
      description: "We have an open-source app teaching financial literacy to low-income families. We need translators to localize the app into Gujarati and Hindi.",
      category: "Education",
      skills: "Translation, Gujarati, Hindi, Proofreading",
      location: "Remote",
      workMode: "REMOTE",
      duration: "2 weeks",
      timeCommitment: "Flexible",
      verificationStatus: "VERIFIED"
    },

    // ---------------- VOLUNTEERING ----------------
    {
      type: "VOLUNTEERING",
      title: "Mega Medical Camp Coordination",
      organisationName: "KSIJ Health Committee",
      postedByUserId: user.id,
      description: "We need 20 enthusiastic volunteers to help manage registration, patient queueing, and basic logistics for the upcoming free medical camp in Dongri.",
      category: "Healthcare",
      skills: "Crowd Management, Event Support, Communication",
      location: "Mumbai",
      workMode: "ONSITE",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timeCommitment: "One day (8 hours)",
      verificationStatus: "VERIFIED"
    },
    {
      type: "VOLUNTEERING",
      title: "Weekend Teaching Assistant (Maths & Science)",
      organisationName: "Community Night School",
      postedByUserId: user.id,
      description: "Help underprivileged children from the community with their math and science homework on weekends. Teaching material will be provided.",
      category: "Education",
      skills: "Teaching, Mathematics, Science, Patience",
      location: "Pune",
      workMode: "ONSITE",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      timeCommitment: "3 hours / weekend",
      verificationStatus: "VERIFIED"
    },
    {
      type: "VOLUNTEERING",
      title: "Senior Citizens Tech Support Volunteer",
      organisationName: "Welfare Committee",
      postedByUserId: user.id,
      description: "Many elderly members struggle with online banking, WhatsApp, and booking cabs. Volunteer to help them get comfortable with basic smartphone usage.",
      category: "Technology & Digital",
      skills: "Patience, Digital Literacy, Communication",
      location: "Bengaluru",
      workMode: "ONSITE",
      timeCommitment: "2 hours / week"
    },
    {
      type: "VOLUNTEERING",
      title: "Ration Distribution Drive (Muharram)",
      organisationName: "KSIJ Relief Trust",
      postedByUserId: user.id,
      description: "Join our logistics team to pack and distribute essential food supplies to families in need across different neighborhoods.",
      category: "Other",
      skills: "Logistics, Teamwork, Physical Labor",
      location: "Mumbai",
      workMode: "ONSITE",
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      timeCommitment: "2 days",
      verificationStatus: "VERIFIED"
    }
  ];

  let createdCount = 0;
  for (const opp of opportunities) {
    await prisma.opportunity.create({
      data: {
        ...opp,
        status: "PUBLISHED"
      }
    });
    createdCount++;
  }

  console.log(`Seeded ${createdCount} comprehensive opportunities successfully!`);
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
