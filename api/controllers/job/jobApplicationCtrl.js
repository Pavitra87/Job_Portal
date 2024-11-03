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

    // Create a notification in the database for the provider
    const notification = await prisma.notification.create({
      data: {
        message: `A new application has been submitted for your job post "${jobListing.title}"`,
        jobId: jobListing.id,
        jobApplicationId: application.id,
        providerId: jobListing.providerId,
        isRead: false,
      },
    });

    // Emit real-time notification to the job provider
    // io.emit("newApplication", {
    //   message: `A new application has been submitted for your job "${jobListing.title}"`,
    //   jobId: jobListing.id,
    //   applicationId: application.id,
    // });

    res.status(200).json(application);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createJobApplication };
