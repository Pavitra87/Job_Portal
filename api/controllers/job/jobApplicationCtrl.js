const prisma = require("../../prismaClient");

// Create Job Application and Send Notification
const createJobApplication = async (req, res) => {
  const { jobId, seekerId } = req.body;
  try {
    // Check if the job listing exists and fetch the provider ID
    const jobListing = await prisma.jobListing.findUnique({
      where: { id: jobId },
      include: { provider: true }, // Fetch provider (job creator) information
    });

    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found" });
    }

    // Create the job application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        seekerId,
        applied_at: new Date(),
      },
    });

    res.status(200).json(application);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//seeker
const getJobApplication = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const seekerId = req.user.id;

    // Fetch all job applications for this seeker
    const applications = await prisma.jobApplication.findMany({
      where: { seekerId: seekerId },
      include: {
        jobListing: {
          select: {
            id: true,
            title: true,
            description: true,
            requirements: true,
            preferredSkills: true,
            address: true,
            education: true,
            experience: true,
            salary_range: true,
            posted_at: true,
            expires_at: true,
          },
        },
      },
    });

    if (applications.length === 0) {
      return res.status(404).json({ message: "No job applications found" });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error retrieving job applications:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching job applications" });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteappliedjob = await prisma.jobApplication.delete({
      where: { id: Number(id) },
    });
    res.status(201).json(deleteappliedjob);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { createJobApplication, deleteApplication, getJobApplication };
