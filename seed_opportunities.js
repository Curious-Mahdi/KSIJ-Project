const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding opportunities...");

  // Get a user to act as the poster
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No users found. Creating a dummy user.");
    return;
  }

  // Check if we already have opportunities
  const count = await prisma.opportunity.count();
  if (count > 0) {
    console.log(`Found ${count} existing opportunities. Clearing them to start fresh...`);
    await prisma.opportunity.deleteMany();
  }

  const opportunities = [
    {
      type: "INTERNSHIP",
      title: "Frontend Developer Intern",
      organisationName: "PixelCraft Digital Agency",
      postedByUserId: user.id,
      description: "We are looking for a passionate Frontend Developer Intern to join our team. You will work closely with designers and senior developers to build beautiful, responsive web applications.",
      category: "Technology & Digital",
      skills: "React, Next.js, JavaScript, CSS",
      location: "Mumbai",
      workMode: "HYBRID",
      experienceLevel: "Student / Fresher",
      employmentType: "INTERNSHIP",
      compensationMin: 10000,
      compensationMax: 15000,
      compensationPeriod: "month",
      duration: "3 months",
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      verificationStatus: "VERIFIED"
    },
    {
      type: "JOB",
      title: "Senior Accountant",
      organisationName: "Al-Noor Financials",
      postedByUserId: user.id,
      description: "Seeking an experienced Senior Accountant to manage financial records, prepare reports, and oversee payroll. Must have strong knowledge of Indian tax laws and Tally ERP.",
      category: "Finance",
      skills: "Accounting, Tally, Taxation, Excel",
      location: "Pune",
      workMode: "ONSITE",
      experienceLevel: "5+ years",
      employmentType: "FULL_TIME",
      compensationMin: 40000,
      compensationMax: 60000,
      compensationPeriod: "month"
    },
    {
      type: "MENTORSHIP",
      title: "Career Mentorship — Technology & AI",
      organisationName: "Community Mentors",
      postedByUserId: user.id,
      description: "I am a Senior Software Engineer with 8 years of experience. I can guide 2 mentees interested in transitioning into AI or improving their frontend skills.",
      category: "Technology & Digital",
      skills: "Career Guidance, Software Engineering, AI, React",
      location: "Remote",
      workMode: "REMOTE",
      experienceLevel: "Student / Fresher",
      mentorCapacity: 2,
      timeCommitment: "2 hours / week",
      verificationStatus: "VERIFIED"
    },
    {
      type: "PROJECT",
      title: "Community Library Digitalisation",
      organisationName: "KSIJ Education Board",
      postedByUserId: user.id,
      description: "We are building a web portal to catalog our community library. Looking for volunteers with React, Node.js, and UX Design skills.",
      category: "Technology & Digital",
      skills: "React, Node.js, UX Design, Data Entry",
      location: "Mumbai",
      workMode: "HYBRID",
      duration: "1 month",
      timeCommitment: "Flexible",
      verificationStatus: "VERIFIED"
    },
    {
      type: "VOLUNTEERING",
      title: "Medical Camp Coordination",
      organisationName: "KSIJ Health Committee",
      postedByUserId: user.id,
      description: "We need 10 volunteers to help manage registration, queue management, and basic assistance for the upcoming medical camp in Dongri.",
      category: "Healthcare",
      skills: "Event Support, Management, Empathy",
      location: "Mumbai",
      workMode: "ONSITE",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timeCommitment: "One day (8 hours)",
      verificationStatus: "VERIFIED"
    }
  ];

  for (const opp of opportunities) {
    await prisma.opportunity.create({
      data: opp
    });
  }

  console.log("Seeded 5 initial opportunities successfully!");
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
