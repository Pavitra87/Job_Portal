const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  //seed role
  const jobProviderRole = await prisma.role.upsert({
    where: { name: "Job Provider" },
    update: {},
    create: { name: "Job Provider" },
  });

  const jobSeekerRole = await prisma.role.upsert({
    where: { name: "Job Seeker" },
    update: {},
    create: { name: "Job Seeker" },
  });

  const guestRole = await prisma.role.upsert({
    where: { name: "Guest" },
    update: {},
    create: { name: "Guest" },
  });

  //seed jobprovider user
  const jobProviderUser = await prisma.user.upsert({
    where: { email: "provider@gmail.com" },
    update: {},
    create: {
      email: "p@gmail.com",
      username: "p",
      password_hash:
        "$2a$10$tXboNZOKWt8Fz9O.md/67.EcrWtvanWEXL2EqlgsW9ulL.1S3OXWm",
      roleId: 1,
    },
  });

  //seed jobseeker user
  const jobSeekerUser = await prisma.user.upsert({
    where: { email: "s@example.com" },
    update: {},
    create: {
      email: "s@example.com",
      username: "s",
      password_hash:
        '"$2a$10$QfK40LbT3W1urlriplNBBOgsnNlQlPHar2OHIcWL28ONjc9okVrG2"', // Replace with actual hash
      roleId: 2,
    },
  });

  //jobprovider profile
  const jobProviderProfile = await prisma.jobProviderProfile.upsert({
    where: { userId: 1 },
    update: {},
    create: {
      userId: 1,
      company_name: "abcde",
      company_description: "A leading company in tech industry.",
      website: "https://provider.com",
      email: "p@gmail.com",
      phone: "123-345",
      location: "mumbai",
    },
  });

  //jobseeker profile
  const jobSeekerProfiles = await prisma.jobSeekerProfile.upsert({
    where: { userId: 2 },
    update: {},
    create: {
      userId: 2,
      first_name: "seeker1",
      last_name: "abcd",
      phone_number: '"435-567"',
      resume_url: "http //",
      skills: { set: ["cleaner", "driver"] },
      experience: { set: ["3year"] }, //{ set: [{ company: 'XYZ Corp', role: 'Developer', years: 3 }] },
      education: "PUC",
      location: "goa",
      preferredJobTypes: { set: ["Remote"] },
    },
  });

  // Seed Job Listings
  const jobListing = await prisma.jobListing.upsert({
    where: { title: "car driver" },
    update: {},
    create: {
      providerId: 1,
      categoryId: 2, // Reference to the teaching category
      title: "High School Math Teacher",
      description:
        "Looking for a passionate High School Math Teacher to inspire students.",
      requirements: { set: ["Teaching Certification"] },
      preferredSkills: {
        set: ["Classroom Management", "Communication Skills"],
      },
      location: "Los Angeles, CA",
      salary_range: "$50,000 - $70,000",
      teachingLevel: "High School",
      expires_at: "2024-10-31 23:59:59",
    },
  });

  // Seed Job Application
  await prisma.jobApplication.create({
    data: {
      jobId: 1,
      seekerId: 1,
      cover_letter_url: "https://example.com/cover_letter.pdf",
      portfolio_url: "//https:Portfolio",
    },
  });

  const softwareDevelopmentCategory = await prisma.jobCategory.upsert({
    where: { name: "teaching" },
    update: {},
    create: { name: "teaching" },
  });

  const dataScienceCategory = await prisma.jobCategory.upsert({
    where: { name: "driver" },
    update: {},
    create: { name: "driver" },
  });
}
