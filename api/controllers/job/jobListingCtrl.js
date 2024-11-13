const prisma = require("../../prismaClient");
const { emitJobPosted } = require("../notification/socket");

//create
const createJobList = async (req, res) => {
  const {
    title,
    description,
    requirements,
    preferredSkills,
    address,
    education,
    experience,
    salary_range,
    posted_at,
    expires_at,
  } = req.body;
  const providerId = req.user?.id;

  try {
    if (req.user.role !== "Job Provider") {
      return res.status(403).json({
        error: "Access denied. Only Job Providers can create job listings.",
      });
    }

    let profileId = req.profile?.id;
    if (!profileId) {
      const profile = await prisma.profile.findUnique({
        where: { userId: providerId },
      });
      if (!profile) {
        return res
          .status(404)
          .json({ error: "Profile not found for the user" });
      }
      profileId = profile.id;
    }

    const jobListing = await prisma.jobListing.create({
      data: {
        title,
        description,
        requirements,
        preferredSkills,
        address,
        education,
        experience,
        salary_range,

        posted_at: new Date(posted_at),
        expires_at: new Date(expires_at),
        provider: {
          connect: { id: providerId },
        },
        profile: {
          connect: { id: profileId },
        },
      },
    });

    res.status(201).json(jobListing);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//get all seeker
const getJoblists = async (req, res) => {
  try {
    const getjoblists = await prisma.jobListing.findMany();
    res.status(201).json(getjoblists);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//update provider
const updateJoblist = async (req, res) => {
  const { id } = req.params; // Get the job listing ID from the request parameters
  const {
    title,
    description,
    requirements,
    preferredSkills,
    address,
    education,
    experience,
    salary_range,
    posted_at,
    expires_at,
  } = req.body;

  const providerId = req.user?.id; // Assuming the provider ID is stored in the user object

  try {
    if (req.user.role !== "Job Provider") {
      return res.status(403).json({
        error: "Access denied. Only Job Providers can update job listings.",
      });
    }

    let profileId = req.profile?.id;
    if (!profileId) {
      const profile = await prisma.profile.findUnique({
        where: { userId: providerId },
      });
      if (!profile) {
        return res
          .status(404)
          .json({ error: "Profile not found for the user" });
      }
      profileId = profile.id;
    }

    // Ensure the 'id' is a valid number before using it in the query
    const jobId = Number(id);
    if (isNaN(jobId)) {
      return res.status(400).json({ error: "Invalid job listing ID" });
    }

    // Check if the job listing exists and if it belongs to the current provider
    const existingJobListing = await prisma.jobListing.findUnique({
      where: {
        id: jobId, // Use the numberified job ID
      },
    });

    if (!existingJobListing) {
      return res.status(404).json({ error: "Job listing not found" });
    }

    if (existingJobListing.providerId !== providerId) {
      return res.status(403).json({
        error: "You can only update job listings created by you.",
      });
    }

    // Update the job listing
    const updatedJobListing = await prisma.jobListing.update({
      where: { id: jobId },
      data: {
        title: title || existingJobListing.title,
        description: description || existingJobListing.description,
        requirements: requirements || existingJobListing.requirements,
        preferredSkills: preferredSkills || existingJobListing.preferredSkills,
        address: address || existingJobListing.address,
        education: education || existingJobListing.education,
        experience: experience || existingJobListing.experience,
        salary_range: salary_range || existingJobListing.salary_range,
        posted_at: posted_at
          ? new Date(posted_at)
          : existingJobListing.posted_at,
        expires_at: expires_at
          ? new Date(expires_at)
          : existingJobListing.expires_at,
        profileId: profileId || existingJobListing.profileId, // Optional: only update if necessary
      },
    });

    res.status(200).json(updatedJobListing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//delete provider
const deleteJoblist = async (req, res) => {
  console.log("Request Params:", req.params); // Log request parameters for debugging
  const { jobId } = req.params;
  const providerId = req.user?.id;

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required." });
  }

  try {
    if (req.user.role !== "Job Provider") {
      return res.status(403).json({
        error: "Access denied. Only Job Providers can delete job listings.",
      });
    }

    const jobIdInt = parseInt(jobId, 10);

    if (isNaN(jobIdInt)) {
      return res.status(400).json({ error: "Invalid Job ID format." });
    }

    const jobListing = await prisma.jobListing.findUnique({
      where: { id: jobIdInt },
    });

    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found." });
    }

    if (jobListing.providerId !== providerId) {
      return res.status(403).json({
        error: "You are not authorized to delete this job listing.",
      });
    }

    await prisma.jobListing.delete({
      where: {
        id: jobIdInt, // Use parsed integer here
      },
    });

    res.status(200).json({ message: "Job listing deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//get one provider
const getJobPost = async (req, res) => {
  try {
    const providerId = req.user.id;

    const jobPosts = await prisma.jobListing.findMany({
      where: {
        providerId: providerId,
      },
      select: {
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
    });

    res.json({ profile: req.user.profile, jobPosts });
  } catch (error) {
    console.error("Error retrieving job posts:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching job posts" });
  }
};

//job provider view  applicants their job posts
// const getapplyjobpostsapplicants = async (req, res) => {
//   const { jobId } = req.params;
//   try {
//     const applicants = await prisma.jobApplication.findMany({
//       where: { jobId: parseInt(jobId) },
//       include: { seeker: true },
//     });
//     res.status(200).json({ applicants });
//   } catch (error) {
//     console.error("Error fetching applicants:", error);
//     res.status(500).json({ error: "Failed to fetch applicants" });
//   }
// };

const getjobapplicants = async (req, res) => {
  const { jobId } = req.params;

  console.log("Received jobId:", jobId); // Debugging line

  // Ensure jobId is a valid number
  const parsedJobId = parseInt(jobId, 10);
  console.log("Parsed jobId:", parsedJobId); // Debugging line

  if (isNaN(parsedJobId)) {
    return res.status(400).json({ error: "Invalid jobId provided" });
  }

  try {
    // Check if the job listing exists
    const jobListing = await prisma.jobListing.findUnique({
      where: { id: parsedJobId },
    });

    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Fetch all applicants for the given jobId
    const applicants = await prisma.jobApplication.findMany({
      where: { jobId: parsedJobId },
      include: {
        seeker: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true, // Or any other relevant information you want to include about the seeker
          },
        },
      },
    });

    // If no applicants found, return a message
    if (applicants.length === 0) {
      return res
        .status(404)
        .json({ message: "No applicants found for this job" });
    }

    // Return the applicants
    res.status(200).json({ applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

module.exports = {
  createJobList,
  updateJoblist,
  deleteJoblist,
  getJobPost,
  getJoblists,
  getjobapplicants,
};
